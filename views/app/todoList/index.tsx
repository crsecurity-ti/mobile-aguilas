import React, { useMemo } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { format } from "date-fns";
import {
  getCompletedTasksCount,
  getTotalTasksCount,
  reorderTasks,
} from "./utils/helpers";
import TodoItem from "./components/TodoItem";
import useTaskList from "./hooks/useTaskList";

const TodoList = () => {
  const { taskList, taskListLoading } = useTaskList();

  console.log(JSON.stringify(taskList, null, 2));

  const completedTasksCount = useMemo(
    () => getCompletedTasksCount(taskList ?? []),
    [taskList]
  );
  const totalTasksCount = useMemo(
    () => getTotalTasksCount(taskList ?? []),
    [taskList]
  );

  const taskListSorted = taskList
    ?.map((item) => ({
      ...item,
      tasksForTheDay: {
        ...item.tasksForTheDay,
        tasks: reorderTasks(item.tasksForTheDay.tasks),
      },
    }))
    .sort((a, b) => {
      const aIncompleteTasks = a.tasksForTheDay.tasks.filter(
        (task) => task.status !== "completed"
      ).length;
      const bIncompleteTasks = b.tasksForTheDay.tasks.filter(
        (task) => task.status !== "completed"
      ).length;

      if (aIncompleteTasks === 0 && bIncompleteTasks === 0) {
        return 0;
      }
      if (aIncompleteTasks === 0) {
        return 1;
      }
      if (bIncompleteTasks === 0) {
        return -1;
      }
      return bIncompleteTasks - aIncompleteTasks;
    });

  return (
    <View className="flex-1 mx-5">
      <View style={styles.header}>
        <Text style={styles.title}>Tareas</Text>
        {!taskListLoading && (
          <Text style={styles.subtitle}>
            {completedTasksCount} / {totalTasksCount} tareas
          </Text>
        )}
      </View>
      {taskListLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      ) : taskList && taskList.length > 0 ? (
        <FlatList
          data={taskListSorted}
          renderItem={({ item }) => <TodoItem todo={item} />}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay tareas</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tareas</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TodoList;
