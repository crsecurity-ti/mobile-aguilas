import "react-native-get-random-values";
import { Platform } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { v4 as uuidv4 } from "uuid";

import { logCatchErr } from "../../../../api/utils/crashlytics";

class NfcService {
  async init() {
    const supported = await NfcManager.isSupported();
    if (supported) {
      await NfcManager.start();
    }
    return supported;
  }

  async stop() {
    return NfcManager.cancelTechnologyRequest();
  }

  async isEnabled() {
    return NfcManager.isEnabled();
  }

  async goToNfcSetting() {
    if (Platform.OS === "android") {
      return NfcManager.goToNfcSetting();
    }
  }

  async isSupported() {
    try {
      return await NfcManager.isSupported();
    } catch (error) {
      logCatchErr(error);
      return false;
    }
  }

  writeToTag = async ({
    type,
    value,
    callback,
  }: {
    type: "TEXT" | "URI" | "WIFI_SIMPLE" | "VCARD";
    value: string;
    callback: ({ uuid, state }: { uuid: string; state: string }) => void;
  }) => {
    let result = false;

    try {
      callback({ uuid: "", state: "WRITING_TAG" });
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: "Ready to write some NDEF",
      });
      callback({ uuid: "", state: "READING_TAG" });

      let bytes = null;
      if (type === "TEXT") {
        bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
      } else if (type === "URI") {
        bytes = Ndef.encodeMessage([Ndef.uriRecord(value)]);
      }

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);

        if (Platform.OS === "ios") {
          await NfcManager.setAlertMessageIOS("Success");
        }

        callback({ uuid: uuidv4(), state: "SUCCESS" });
        result = true;
      }
    } catch (ex) {
      logCatchErr(ex);
    } finally {
      callback({ uuid: "", state: "FINISH_TAG" });
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  };

  readTag = async ({
    callback,
  }: {
    callback: ({
      uuid,
      state,
      tag,
    }: {
      uuid: string;
      state: string;
      tag: string;
    }) => void;
  }) => {
    try {
      callback({ uuid: "", state: "READING_TAG", tag: "" });
      await NfcManager.requestTechnology([NfcTech.Ndef]);
      const tag = await NfcManager.getTag();
      await NfcManager.cancelTechnologyRequest();
      callback({
        uuid: uuidv4(),
        state: "SUCCESS",
        tag: tag?.ndefMessage[0].payload ?? "",
      });
    } catch (ex) {
      callback({ uuid: "", state: "ERROR", tag: "" });
      logCatchErr(ex);
    }
  };
}

export default new NfcService();
