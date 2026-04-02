import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, View, Text } from "react-native";
import { Ndef } from "react-native-nfc-manager";

import { logCatchErr } from "../../../../api/utils/crashlytics";
import { useUserStore } from "../../../../store/auth";
import NfcProxy from "../../mapAdmin/list/NfcProxy";
import { updateRoundSupervisorStatusDb } from "../../../../api/firestore/roundsSupervisorApi";

NfcProxy.init();

const NFCButton = ({ roundUuid }: { roundUuid: string }) => {
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

  const validateNFCCode = async (nfcCode: any) => {
    await updateRoundSupervisorStatusDb({
      userUuid: user?.uuid ?? "",
      nfcCode,
      roundUuid: roundUuid as string,
      status: "check",
      checkData: {
        time: new Date().valueOf(),
      },
    });
    alert("NFC validado correctamente");
  };

  useEffect(() => {
    if (currentState.state === "SUCCESS") {
      const message = Ndef.text.decodePayload(currentState.tag as any);
      validateNFCCode(message);
    }
  }, [currentState.uuid]);

  const readNFC = async () => {
    if (!isSupportedNFC) {
      console.log("not supported");
      return;
    }
    if (!isEnabledNFC) {
      console.log("not enabled");
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
        <Text className="text-center font-semibold">
          NFC no soportado, ingrese con un dispositivo que tenga NFC para
          configurar los tags.
        </Text>
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
          Validar Visita con NFC
        </Text>
      </Pressable>
    );
  }

  if (currentState.state === "READING_TAG") {
    return (
      <View className="mx-5">
        <Text className="text-center font-semibold text-blue-500">
          Por favor acerque el dispositivo al tag NFC
        </Text>
      </View>
    );
  }

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
        Validar Visita con NFC
      </Text>
    </Pressable>
  );
};

export default NFCButton;
