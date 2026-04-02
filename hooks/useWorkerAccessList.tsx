import { useMemo } from "react";

import useAccessWorkerList from "./useAccessWorkerList";
import useWorkerList from "./useWorkerList";
import { AccessControlWorker, Worker } from "../types";

export interface CustomWorkerAccessList extends Worker {
  accessControlWorker?: AccessControlWorker;
}

const useWorkerAccessList = () => {
  const { workerListData, workerListDataLoading } = useWorkerList();
  const { accessControlWorkerListData, accessControlWorkerListDataLoading } =
    useAccessWorkerList();

  const isLoading = workerListDataLoading || accessControlWorkerListDataLoading;

  const workerAccessListData: CustomWorkerAccessList[] = useMemo(() => {
    if (!isLoading && workerListData.length > 0) {
      return workerListData.map((worker: Worker) => {
        const accessControlWorker = accessControlWorkerListData.find(
          (accessControlWorker) =>
            accessControlWorker.workerUuid === worker.uuid,
        );

        return {
          ...worker,
          accessControlWorker,
        };
      });
    }

    return [];
  }, [isLoading, workerListData, accessControlWorkerListData]);

  return {
    workerAccessListData,
    workerAccessListDataLoading: isLoading,
  };
};

export default useWorkerAccessList;
