import React from "react";
import { View, Text } from "react-native";
import TaskItem from "./TaskItem";
import { TaskList } from "../types";
import { Ionicons } from "@expo/vector-icons";

interface TodoItemProps {
  todo: TaskList;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => (
  <View className="flex-1">
    <View className="flex-row justify-between items-center">
      <Text className="text-lg font-bold capitalize px-2">
        {todo.tasksForTheDay.name}
      </Text>
      {todo.tasksForTheDay.tasks.reduce(
        (acc, task) => acc + (task.status === "completed" ? 1 : 0),
        0
      ) === todo.tasksForTheDay.tasks.length ? (
        <Ionicons name="checkmark-circle-outline" size={24} color="green" />
      ) : todo.tasksForTheDay.tasks.some((task) => task.status === "completed") ? (
        <Ionicons name="remove-circle-outline" size={24} color="gray" />
      ) : (
        <Ionicons name="ellipse-outline" size={24} color="gray" />
      )}
    </View>
    {todo.tasksForTheDay.tasks.map((task) => (
      <TaskItem key={task.uuid} task={{ ...task, mainTaskUuid: todo.uuid }} />
    ))}
  </View>
);

export default TodoItem;
