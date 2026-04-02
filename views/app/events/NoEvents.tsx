import React from "react";
import { Text, View } from "react-native";

const NoEvents = () => {
  return (
    <View className="flex items-center justify-center mt-10">
      <Text className="text-2xl font-semibold text-info-700 text-center">
        No has creado ningún evento hoy
      </Text>
      <Text className="text-base mt-5 font-semibold text-center text-gray-800">
        Puedes agregar un nuevo evento desde el botón "Agregar un nuevo evento"
      </Text>
    </View>
  );
};

export default NoEvents;
