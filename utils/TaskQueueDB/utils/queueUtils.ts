import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
import BackgroundService from "react-native-background-actions";
import RNFS from "react-native-fs";

import { logCatchErr } from "../../../api/utils/crashlytics";
import { ImagesUpload, TaskStateEnum } from "../../../database/model/types";
import {
  getAllImagesUploads,
  removeImageUploadFromDb,
  updateImagesUploadInDb,
} from "../../../database/services/imagesUpload.service";
import {
  createOrUpdateStatus,
  getProcessStatusByName,
} from "../../../database/services/processStatus.service";
import { uploadToFirebase } from "../../../views/app/newEvent/utils";
import {
  updateEventImagesInFirestore,
  updateEventSupervisorImagesInFirestore,
} from "../../../api/firestore/eventApi";
import { createErrorLogInFirestore } from "../../../api/firestore/errorLogApi";
import { addMinutes, isBefore } from "date-fns";
import { updateTaskImagesInFirestore } from "../../../api/firestore/taskListApi";

const CONCURRENCY_TASK = 3;

const updateSyncStatus = async (value: boolean) => {
  await createOrUpdateStatus({ name: TaskStateEnum.SYNC_QUEUE, value });
};

const updateSyncNotification = async (title: string, description: string) => {
  await BackgroundService.updateNotification({
    taskTitle: title,
    taskDesc: description,
  });
};

const deleteFileByUri = async (uri: string) => {
  try {
    const fileExists = await RNFS.exists(uri);
    if (fileExists) {
      await RNFS.unlink(uri);
    }
  } catch (error) {
    logCatchErr(`Error deleting file: ${error}`);
  }
};

const handleFileDeletion = async (imagesTasks: ImagesUpload[]) => {
  for (const imageUpload of imagesTasks) {
    if (imageUpload.state === TaskStateEnum.COMPLETED) {
      try {
        await deleteFileByUri(imageUpload.currentImage);
        await removeImageUploadFromDb(imageUpload.id);
      } catch (error) {
        logCatchErr(`Error during file or DB deletion: ${error}`);
      }
    }
  }
};

export const processQueue = async () => {
  const options = {
    color: "#cccccc",
    parameters: { delay: 1000 },
    taskDesc: "Sincronizando datos...",
    taskIcon: { name: "ic_launcher", type: "mipmap" },
    taskName: "DataSync",
    taskTitle: "Sincronización en curso",
    foregroundServiceType: ["dataSync"],
  };

  BackgroundService.on("expiration", async () => {
    await updateSyncNotification(
      "Requieres sincronizar",
      "Tienes imágenes sin sincronizar"
    );
    await updateSyncStatus(false);
  });

  await BackgroundService.start(triggerSyncQueue, options);
};

export const startQueue = async () => {
  if (!BackgroundService.isRunning()) {
    processQueue();
  }
};

const handleTaskUpload = async (task: ImagesUpload) => {
  try {
    const uploadResult: any = await uploadToFirebase({
      uri: task.currentImage,
      name: task.name,
    });

    if (!uploadResult?.downloadUrl) {
      await createErrorLogInFirestore({
        error: "Error al subir la imagen",
        errorType: "UPLOAD_IMAGE",
        data: { task, uploadResult },
        userUuid: task.userUuid,
      });

      await updateSyncNotification(
        "Problema en la sincronización",
        "Hubo un problema en la sincronización"
      );
      await updateImagesUploadInDb([{ ...task, state: TaskStateEnum.ERROR }]);
      return;
    }

    if (task.typeEvent === "task") {
      await updateTaskImagesInFirestore({
        taskUuid: task.eventUuid,
        mainTaskUuid: task.contractorUuid,
        userUuid: task.userUuid,
        images: [uploadResult.downloadUrl],
      });
    }

    if (task.typeEvent === "guard") {
      await updateEventImagesInFirestore({
        eventUuid: task.eventUuid,
        images: [uploadResult.downloadUrl],
        contractorUuid: task.contractorUuid,
      });
    }

    if (task.typeEvent !== "guard" && task.typeEvent !== "task") {
      await updateEventSupervisorImagesInFirestore({
        eventUuid: task.eventUuid,
        images: [uploadResult.downloadUrl],
        userUuid: task.userUuid,
      });
    }

    await updateImagesUploadInDb([{ ...task, state: TaskStateEnum.COMPLETED }]);
  } catch (error: any) {
    Alert.alert("Error", error.message);
    logCatchErr(error);
    await updateSyncNotification(
      "Problema en la sincronización",
      "Hubo un problema en la sincronización"
    );
    await updateImagesUploadInDb([{ ...task, state: TaskStateEnum.ERROR }]);
  }
};

const categorizeTasks = (tasks: ImagesUpload[]) => {
  return tasks.reduce(
    (result: any, task: any) => {
      if (task.state === TaskStateEnum.ERROR) {
        result.errorTasks.push(task);
      } else if (task.state === TaskStateEnum.PROCESSING) {
        result.processingTasks.push(task);
      } else if (task.state === TaskStateEnum.WAITING) {
        result.waitingTasks.push(task);
      } else if (task.state === TaskStateEnum.COMPLETED) {
        result.completedTasks.push(task);
      }
      return result;
    },
    {
      completedTasks: [],
      errorTasks: [],
      processingTasks: [],
      waitingTasks: [],
    }
  );
};

const getTasksToRun = ({
  errorTasks,
  processingTasks,
  waitingTasks,
}: {
  errorTasks: ImagesUpload[];
  processingTasks: ImagesUpload[];
  waitingTasks: ImagesUpload[];
}) => {
  let tasksToRun = [...processingTasks, ...errorTasks, ...waitingTasks];
  return tasksToRun.slice(0, CONCURRENCY_TASK);
};

export const triggerSyncQueue = async () => {
  try {
    const preImagesTasks = await getAllImagesUploads();
    await handleFileDeletion(preImagesTasks);

    const status = await getProcessStatusByName(TaskStateEnum.SYNC_QUEUE);
    if (status.length && status[0].value === 1) {
      if (!isBefore(addMinutes(status[0].lastUpdate, 5), new Date())) {
        return;
      }
    }

    await updateSyncStatus(true);
    await updateSyncNotification("Sincronizando", "Sincronizando");

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      await updateSyncNotification(
        "No hay conexión a internet",
        "No hay conexión a internet"
      );
      await updateSyncStatus(false);
      await BackgroundService.stop();
      return;
    }

    const imagesTasks = await getAllImagesUploads();
    if (imagesTasks.length === 0) {
      await updateSyncStatus(false);
      return;
    }

    const categorizedTasks = categorizeTasks(imagesTasks);
    const { errorTasks, processingTasks, waitingTasks } = categorizedTasks;

    if (waitingTasks.length === 0 && errorTasks.length === 0) {
      await updateSyncStatus(false);
      return;
    }

    if (
      processingTasks.length > 0 &&
      (waitingTasks.length === 0 || processingTasks.length >= CONCURRENCY_TASK)
    ) {
      await updateSyncStatus(false);
      return;
    }

    const tasksToRun = getTasksToRun({
      errorTasks,
      processingTasks,
      waitingTasks,
    });
    await updateImagesUploadInDb(
      tasksToRun.map((task) => ({ ...task, state: TaskStateEnum.PROCESSING }))
    );

    for (const task of tasksToRun) {
      await handleTaskUpload(task);
    }

    await updateSyncStatus(false);
    await triggerSyncQueue();
  } catch (error) {
    logCatchErr(error);
    await updateSyncStatus(false);
  }
};
