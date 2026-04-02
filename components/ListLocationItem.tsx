import React from "react";
import { View, Pressable, Text } from "react-native";

export const ListLocationItem = ({
  setCurrentLocationSelected,
  handlePresentModalPress,
  item,
  index,
}: {
  setCurrentLocationSelected: any;
  handlePresentModalPress: any;
  item: any;
  index: number;
}) => {
  const translate = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "check":
        return "Completado";
      case "in_progress":
        return "En progreso";
      default:
        return "Sin estado";
    }
  };

  return (
    <Pressable
      onPress={() => {
        setCurrentLocationSelected({ ...item, position: index });
        handlePresentModalPress();
      }}
      className="px-5 py-2 rounded-md my-2 bg-white flex-1 flex-row justify-center"
    >
      <View className="mr-5 bg-gray-500 h-7 w-7 rounded-full z-1 justify-center">
        <Text className="text-white text-center">{index + 1}</Text>
      </View>
      <Text className="flex-1 mr-5 justify-center font-semibold">
        Nombre: {item.name}
      </Text>
      {item.status ? (
        <Text className="flex-1 justify-end font-semibold">
          Status: {translate(item.status)}
        </Text>
      ) : null}
    </Pressable>
  );
};
