import React from "react";
import { Text, View } from "react-native";

import ButtonDS from "../../../../components/ButtonDS";
import NFCButton from "../list/NFCButton";

const BottomSheetBody = ({
  name,
  position,
  nfcCode,
  updateLocation,
}: {
  name: string;
  position: number;
  nfcCode: string;
  updateLocation: () => void;
}) => {
  return (
    <View className="flex-1 justify-evenly mx-5 mb-10">
      <Text className="text-center">
        Nombre: <Text className="font-semibold">{name}</Text>
      </Text>
      <Text className="text-center">
        Ubicación: <Text className="font-semibold">{(position || 0) + 1}</Text>
      </Text>
      <ButtonDS
        className="mt-0"
        onPress={() => updateLocation()}
        text="Actualizar la ubicación de este punto a mi posición"
      />
      <NFCButton nfcCode={nfcCode ?? "123123"} />
    </View>
  );
};

export default BottomSheetBody;
