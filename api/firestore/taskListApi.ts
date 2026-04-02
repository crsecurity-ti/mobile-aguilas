import firestore from "@react-native-firebase/firestore";

export const updateTaskDayListInFirestore = async ({
  userUuid,
  mainTaskUuid,
  taskUuid,
  status,
  images,
  userDescription,
  updatedTime,
}: {
  userUuid: string;
  mainTaskUuid: string;
  taskUuid: string;
  status: string;
  userDescription: string;
  images: string[];
  updatedTime: Date;
}) => {
  const docRef = firestore()
    .collection("tasksByDays")
    .doc("user")
    .collection(userUuid)
    .doc(mainTaskUuid);

  try {
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();

      if (data) {
        const updatedTasks = data.tasksForTheDay.tasks.map((task: any) =>
          task.uuid === taskUuid
            ? { ...task, status, images, userDescription, updatedTime }
            : task
        );

        const newData = {
          ...data,
          tasksForTheDay: {
            ...data.tasksForTheDay,
            tasks: updatedTasks,
          },
        };

        await docRef.update(newData);
        console.log("Task updated successfully.");
      }
    } else {
      console.error("Document does not exist.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const updateTaskImagesInFirestore = async ({
  taskUuid,
  userUuid,
  mainTaskUuid,
  images,
}: {
  taskUuid: string;
  userUuid: string;
  mainTaskUuid: string;
  images: string[];
}) => {
  const docRef = firestore()
    .collection("tasksByDays")
    .doc("user")
    .collection(userUuid)
    .doc(mainTaskUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data) {
      const updatedTasks = data.tasksForTheDay.tasks.map((task: any) =>
        task.uuid === taskUuid
          ? { ...task, images: [...task.images, ...images] }
          : task
      );
      const newData = {
        ...data,
        tasksForTheDay: {
          ...data.tasksForTheDay,
          tasks: updatedTasks,
        },
      };
      await docRef.update(newData);
    }
  }
};
