import React from "react";
import { Text, View } from "react-native";

const AccessWorkerHeader = ({
  workersIn,
  workersOut,
}: {
  workersIn: number;
  workersOut: number;
}) => {
  return (
    <>
      <View className="flex-row justify-between mx-3 mt-3">
        <Text className="text-center capitalize font-bold">
          Trabajadores En el recinto
        </Text>
        <Text className="text-xl text-blue-800">{workersIn}</Text>
      </View>
      <View className="flex-row justify-between mx-3 mb-2">
        <Text className="text-sm self-center capitalize text-gray-500 font-semibold">
          Trabajadores Fuera del recinto
        </Text>
        <Text className="text-lg text-red-600">{workersOut}</Text>
      </View>
    </>
  );
};

export default AccessWorkerHeader;
