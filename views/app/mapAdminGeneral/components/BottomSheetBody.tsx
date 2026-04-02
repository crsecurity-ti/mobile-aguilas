import React from "react";
import { Text, View } from "react-native";

import ButtonDS from "../../../../components/ButtonDS";
import NFCButton from "../../mapAdmin/list/NFCButton";

const BottomSheetBody = ({
  contractorName,
  contractorNfcCode,
  updateLocation,
}: {
  contractorName: string;
  contractorNfcCode: string;
  updateLocation: () => void;
}) => {
  return (
    <View className="flex-1 justify-evenly mx-5 mb-10">
      <Text className="text-lg text-center my-5">
        Instalación: <Text className="font-semibold">{contractorName}</Text>
      </Text>
      <ButtonDS
        className="mt-0"
        onPress={() => updateLocation()}
        text="Actualizar la ubicación de la instalación a mi posición"
      />
      <NFCButton nfcCode={contractorNfcCode ?? "123123"} />
    </View>
  );
};

export default BottomSheetBody;
