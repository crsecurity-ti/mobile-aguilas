import React from "react";
import { Text, View } from "react-native";
import { PAGE_HEIGHT } from "./utils";

const CarouselEmpty = () => {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ height: PAGE_HEIGHT * 0.2 }}
    >
      <Text className="text-lg font-bold">
        Agrega una imagen para visualizarla aquí
      </Text>
    </View>
  );
};

export default CarouselEmpty;
