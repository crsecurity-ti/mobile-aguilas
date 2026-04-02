import firestore from "@react-native-firebase/firestore";
import { format, subDays, parse, isAfter } from "date-fns";
import { useEffect, useState } from "react";

import { useUserStore } from "../../../../store/auth";
import { TaskList } from "../types";

const useTaskList = () => {
  const user = useUserStore((state) => state.user);
  const [taskList, setTaskList] = useState<TaskList[]>();
  const [taskListLoading, setTaskListLoading] = useState<boolean>(true);

  console.log(user?.uuid);
  useEffect(() => {
    if (!user?.uuid) {
      setTaskListLoading(false);
      return;
    }

    const taskListRef = firestore()
      .collection("tasksByDays")
      .doc("user")
      .collection(user.uuid);

    const todayFormatted = format(new Date(), "yyyy-MM-dd");
    const yesterdayFormatted = format(subDays(new Date(), 1), "yyyy-MM-dd");

    let unsubscribe: () => void;

    const fetchData = () => {
      const now = new Date();

      console.log({ todayFormatted, yesterdayFormatted });
      unsubscribe = taskListRef
        .where("dayFormatted", "in", [todayFormatted, yesterdayFormatted])
        .onSnapshot(
          (querySnapshot) => {
            console.log({
              docs: querySnapshot.docs
                .map(
                  (doc) =>
                    ({
                      ...doc.data(),
                      uuid: doc.id,
                    }) as TaskList
                )
                .filter(
                  (task) =>
                    task.dayFormatted === todayFormatted ||
                    (task.dayFormatted === yesterdayFormatted &&
                      task.enableShiftNextDay === true)
                ),
            });
            const tasks = querySnapshot.docs
              .map(
                (doc) =>
                  ({
                    ...doc.data(),
                    uuid: doc.id,
                  }) as TaskList
              )
              .filter(
                (task) =>
                  task.dayFormatted === todayFormatted ||
                  (task.dayFormatted === yesterdayFormatted &&
                    task.enableShiftNextDay === true)
              )
              .map((task) => ({
                ...task,
                tasksForTheDay: task.tasksForTheDay
                  ? {
                      ...task.tasksForTheDay,
                      tasks: task.tasksForTheDay.tasks?.filter((t) => {
                        console.log({ t });
                        if (!task.shiftLimitEnd) return true;

                        if (
                          task.dayFormatted === todayFormatted &&
                          task.enableShiftNextDay === true
                        ) {
                          return true;
                        }

                        const shiftEndTime = parse(
                          task.shiftLimitEnd,
                          "HH:mm",
                          new Date()
                        );
                        console.log(shiftEndTime, now);
                        return isAfter(shiftEndTime, now);
                      }),
                    }
                  : task.tasksForTheDay,
              }))
              .filter(
                (task) =>
                  !task.tasksForTheDay ||
                  !task.tasksForTheDay.tasks ||
                  task.tasksForTheDay.tasks.length > 0
              );

            setTaskList(tasks);
            setTaskListLoading(false);
          },
          (error) => {
            console.error(error);
            setTaskListLoading(false);
          }
        );
    };

    fetchData();

    const interval = setInterval(fetchData, 60 * 1000);

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uuid]);

  return {
    taskList,
    setTaskList,
    taskListLoading,
  };
};

export default useTaskList;
