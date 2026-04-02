import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SuccessMatchCard = ({
  currentMatchData,
}: {
  currentMatchData: {
    name: string;
    rut: string;
    matchPercentage: number;
  };
}) => {
  return (
    <View
      className={
        "bg-white rounded-md flex-1 w-full shadow-lg border-4 border-green-800"
      }
    >
      <View className="flex-row justify-between p-6">
        <View className="flex-col gap-2">
          <Text className="text-2xl font-bold">{currentMatchData.name}</Text>
          <Text className="text-md font-bold">{currentMatchData.rut}</Text>
          <Text className="text-md">
            {currentMatchData.matchPercentage}% match
          </Text>
        </View>
        <View className="flex-col gap-2">
          <MaterialCommunityIcons name="check-circle" color="green" size={75} />
        </View>
      </View>
    </View>
  );
};

export default SuccessMatchCard;
