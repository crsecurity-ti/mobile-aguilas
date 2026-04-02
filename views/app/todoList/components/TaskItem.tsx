import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Task } from "../types";
import { v4 as uuidv4 } from "uuid";

interface TaskItemProps {
  task: Task & { mainTaskUuid: string };
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => (
  <Pressable
    onPress={() => {
      router.navigate({
        pathname: "/todo-simple",
        params: { task: JSON.stringify(task), uniqueUuid: uuidv4() },
      });
    }}
  >
    <View className="flex-1 flex-row justify-between bg-gray-100 rounded-md p-4 my-2 items-center">
      <View className="flex-1">
        <Text className="text-lg font-bold capitalize">{task.name}</Text>
        <Text className="text-sm text-gray-500 capitalize">
          {task.description}
        </Text>
      </View>
      <Ionicons
        name={
          task.status === "completed"
            ? "checkmark-circle-outline"
            : "ellipse-outline"
        }
        color={task.status === "completed" ? "green" : "gray"}
        size={20}
      />
    </View>
  </Pressable>
);

export default TaskItem;
