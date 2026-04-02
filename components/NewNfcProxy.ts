import "react-native-get-random-values";
import { Platform } from "react-native";
import NfcManager, {
  Ndef,
  NfcEvents,
  NfcTech,
} from "react-native-nfc-manager";
import { v4 as uuidv4 } from "uuid";

import { logCatchErr } from "../api/utils/crashlytics";

class NewNfcService {
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
    return NfcManager.goToNfcSetting();
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
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // iOS-specific alert message
      if (Platform.OS === "ios") {
        await NfcManager.setAlertMessageIOS("Ready to write data to the tag");
      }
      
      const tag = await NfcManager.getTag();
      callback({ uuid: "", state: "READING_TAG" });

      let bytes = null;
      if (type === "TEXT") {
        bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
      } else if (type === "URI") {
        bytes = Ndef.encodeMessage([Ndef.uriRecord(value)]);
      }

      if (bytes) {
        // Check for ndefHandler availability
        if (NfcManager.ndefHandler) {
          await NfcManager.ndefHandler.writeNdefMessage(bytes);
        } else {
          throw new Error("NDEF handler not available");
        }

        // iOS-specific success alert
        if (Platform.OS === "ios") {
          await NfcManager.setAlertMessageIOS("Success");
        }

        callback({ uuid: uuidv4(), state: "SUCCESS" });
        result = true;
      }
    } catch (ex) {
      console.log("Error writing to tag", ex);
      logCatchErr(ex);
    } finally {
      callback({ uuid: "", state: "FINISH_TAG" });
      await NfcManager.cancelTechnologyRequest();
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
      message,
    }: {
      uuid: string;
      state: string;
      tag: string;
      message: string;
    }) => void;
  }) => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag: any) => {
      try {
        const message = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
        NfcManager.setAlertMessageIOS("NFC Tag Discovered");
        NfcManager.unregisterTagEvent().catch(() => 0);
        callback({
          uuid: uuidv4(),
          state: "SUCCESS",
          tag: tag?.ndefMessage[0].payload ?? "",
          message,
        });
      } catch (ex) {
        console.log(ex);
        logCatchErr(ex);
      }
    });

    NfcManager.registerTagEvent();
  };
}

export default new NewNfcService();
