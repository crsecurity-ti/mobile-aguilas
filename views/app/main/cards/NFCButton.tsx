import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, View, Text } from "react-native";
import NfcManager, { Ndef } from "react-native-nfc-manager";

import { logCatchErr } from "../../../../api/utils/crashlytics";
import { useUserStore } from "../../../../store/auth";
import NfcProxy from "../../mapAdmin/list/NfcProxy";
import ButtonDS from "../../../../components/ButtonDS";
import Toast from "react-native-toast-message";

NfcManager.start();

const NFCButton = ({
  nfcCode,
  callback,
  texts = {
    notSupported:
      "NFC no soportado, ingrese con un dispositivo que tenga NFC para iniciar el turno.",
    pleaseApproach: "Por favor acerque el dispositivo al tag NFC",
    startTurn: "Iniciar Turno con NFC",
    notEnabled: "NFC no habilitado, por favor habilite NFC en el dispositivo",
  },
}: {
  nfcCode: string[];
  callback: () => void;
  texts?: {
    notSupported: string;
    pleaseApproach: string;
    startTurn: string;
    notEnabled: string;
  };
}) => {
  const user = useUserStore((state) => state.user);
  const [isSupportedNFC, setIsSupportedNFC] = React.useState(false);
  const [isEnabledNFC, setIsEnabledNFC] = React.useState(false);
  const [currentState, setCurrentState] = React.useState({
    uuid: 1,
    state: "FINISH_TAG",
    tag: "",
  });

  useEffect(() => {
    try {
      NfcProxy.isSupported().then((supported) => {
        setIsSupportedNFC(supported);
      });
    } catch (e) {
      setIsSupportedNFC(false);
      logCatchErr(e);
    }
    try {
      NfcProxy.isEnabled().then((enabled) => setIsEnabledNFC(enabled));
    } catch (e) {
      setIsEnabledNFC(false);
      logCatchErr(e);
    }
  }, []);

  useEffect(() => {
    if (currentState.state === "SUCCESS") {
      const message = Ndef.text.decodePayload(currentState.tag as any);
      if (nfcCode.includes(message)) {
        callback();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Código NFC no válido",
        });
      }
    }
  }, [currentState.uuid]);

  const readNFC = async () => {
    if (!isSupportedNFC) {
      console.log("not supported");
      return;
    }
    if (!isEnabledNFC) {
      NfcProxy.goToNfcSetting();
      return;
    }

    await NfcProxy.readTag({
      callback: setCurrentState as any,
    });
  };

  if (!isSupportedNFC) {
    return (
      <View className="mx-5">
        <Text className="text-center font-semibold">{texts.notSupported}</Text>
      </View>
    );
  }

  if (
    currentState.state === "FINISH_TAG" ||
    currentState.state === "ERROR" ||
    currentState.state === "SUCCESS"
  ) {
    return (
      <Pressable
        className="mx-3 mt-2 border border-gray-300 p-4 flex-row flex justify-center rounded-lg"
        onPress={() => readNFC()}
      >
        <Ionicons
          className="pr-2"
          name="code-working-outline"
          color="#0284c7"
          size={18}
        />
        <Text className="text-center text-sky-600 font-semibold">
          {texts.startTurn}
        </Text>
      </Pressable>
    );
  }

  if (currentState.state === "READING_TAG") {
    return (
      <View className="mx-5">
        <Text className="text-center font-semibold text-blue-500">
          {texts.pleaseApproach}
        </Text>
      </View>
    );
  }

  return <ButtonDS onPress={() => readNFC()} text={texts.notEnabled} />;
};

export default NFCButton;
