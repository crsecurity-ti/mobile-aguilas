import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SuccessMatchCard = () => {
  return (
    <View
      className={
        "bg-white rounded-md flex-1 w-full shadow-lg border-4 border-red-800"
      }
    >
      <View className="flex-row justify-between p-6">
        <View className="flex-col gap-2">
          <Text className="text-2xl font-bold">No hay coincidencia</Text>
          <Text className="text-md">0% match</Text>
        </View>
        <View className="flex-col gap-2">
          <MaterialCommunityIcons name="close-circle" color="red" size={75} />
        </View>
      </View>
    </View>
  );
};

export default SuccessMatchCard;
