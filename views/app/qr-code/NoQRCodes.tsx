import React from "react";
import { Text, View } from "react-native";

const NoQRCodes = () => {
  return (
    <View className="flex items-center justify-center mt-10">
      <Text className="text-2xl font-semibold text-info-700 text-center">
        No has validado ningún código qr hoy
      </Text>
      <Text className="text-base mt-5 font-semibold text-center text-gray-800">
        Puedes validar un nuevo código QR desde el botón "Validar Código QR"
      </Text>
    </View>
  );
};

export default NoQRCodes;
