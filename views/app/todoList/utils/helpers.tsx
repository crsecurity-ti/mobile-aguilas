import { Task, TaskList } from "../types";

export const getCompletedTasksCount = (todos: TaskList[]) =>
  todos.reduce(
    (count, todo) =>
      count +
      todo.tasksForTheDay.tasks.filter((task) => task.status === "completed")
        .length,
    0
  );

export const getTotalTasksCount = (todos: TaskList[]) =>
  todos.reduce((count, todo) => count + todo.tasksForTheDay.tasks.length, 0);

export const reorderTasks = (tasks: Task[]) => {
  return tasks.sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return 0;
  });
};
