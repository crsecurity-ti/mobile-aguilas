import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";

import NfcProxy from "./NfcProxy";
import { logCatchErr } from "../../../../api/utils/crashlytics";
import ButtonDS from "../../../../components/ButtonDS";

NfcProxy.init();

const NFCButton = ({ nfcCode = "33293828" }: { nfcCode: string }) => {
  const [isSupportedNFC, setIsSupportedNFC] = React.useState(false);
  const [isEnabledNFC, setIsEnabledNFC] = React.useState(false);
  const [currentState, setCurrentState] = React.useState({
    uuid: 1,
    state: "FINISH_TAG",
  });

  useEffect(() => {
    const checkNFC = async () => {
      try {
        const supported = await NfcProxy.isSupported();
        setIsSupportedNFC(supported);
        const enabled = await NfcProxy.isEnabled();
        setIsEnabledNFC(enabled);
      } catch (e) {
        setIsSupportedNFC(false);
        setIsEnabledNFC(false);
        logCatchErr(e);
      }
    };

    checkNFC();
  }, []);

  useEffect(() => {
    if (currentState.state === "SUCCESS") {
      alert("NFC actualizado correctamente");
    }
  }, [currentState.uuid]);

  const updateNFC = async () => {
    if (!isSupportedNFC) {
      return;
    }
    if (!isEnabledNFC) {
      NfcProxy.goToNfcSetting();
      return;
    }
    if (!nfcCode || nfcCode === "") {
      return;
    }

    await NfcProxy.writeToTag({
      type: "TEXT",
      value: nfcCode,
      callback: setCurrentState as any,
    });
  };

  if (!isSupportedNFC) {
    return (
      <View className="mx-5">
        <Text className="text-center font-semibold">
          NFC no soportado, ingrese con un dispositivo que tenga NFC para
          configurar los tags.
        </Text>
      </View>
    );
  }

  if (currentState.state === "FINISH_TAG") {
    return (
      <ButtonDS
        onPress={() => updateNFC()}
        text="Actualizar el NFC de esta ubicación"
      />
    );
  }

  if (currentState.state === "WRITING_TAG") {
    return (
      <View className="mx-5">
        <Text className="text-center font-semibold text-blue-500">
          Por favor acerque el dispositivo al tag NFC
        </Text>
      </View>
    );
  }

  if (currentState.state === "READING_TAG") {
    return (
      <View className="mx-5">
        <Text className="text-center font-semibold text-blue-500">
          Estamos escribiendo en el tag
        </Text>
      </View>
    );
  }

  return (
    <ButtonDS
      onPress={() => updateNFC()}
      text="Actualizar el NFC de esta ubicación"
    />
  );
};

export default NFCButton;
