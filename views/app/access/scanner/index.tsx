import "react-native-get-random-values";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { isValidUrl } from "../../../../utils/utils";
import BarCodeContainer from "../../../../components/BarCode/BarCodeContainer";
import { formatRut } from "../../../../utils/rutUtils";

const AccessPersonalScannerView = () => {
  const router = useRouter();
  const { status } = useLocalSearchParams();

  const onValidateQRCode = async (data: string) => {
    if (isValidUrl(data)) {
      const url = data;

      const urlObj = new URL(url);

      const runParam = urlObj.searchParams.get("RUN");
      const runFormatted = formatRut(runParam ?? "");

      if (status === "in") {
        return router.navigate({
          pathname: "access-manual",
          params: {
            run: runFormatted ?? "",
            uuid: uuidv4(),
          },
        });
      } else {
        return router.navigate({
          pathname: "access-personal-out",
          params: {
            run: runFormatted.split("-")[0] ?? "",
            uniqueInstance: uuidv4(),
          },
        });
      }
    } else {
      return alert("No es un carnet valido");
    }
  };
  return <BarCodeContainer validateQRCode={onValidateQRCode} />;
};

export default AccessPersonalScannerView;
