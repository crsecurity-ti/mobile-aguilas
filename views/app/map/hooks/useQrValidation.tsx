import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { canContinueConsecutively } from "../../../../utils/utils";
import { getDistance } from "geolib";
import { updateLocationStatus } from "../../../../api/firestore/roundsByDaysApi";
import { useUserStore } from "../../../../store/auth";
import { Round } from "../../../../types";
import { RoundGuard } from "../../rounds/types";

const useQrValidation = ({
  roundData,
  currentLocation,
  roundsListData,
}: {
  roundData: Round | undefined;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  roundsListData: RoundGuard[];
}) => {
  const user = useUserStore((state) => state.user);

  const { uuid, roundListDataUuid, qrCode, uniqueQrCodeInstance } =
    useLocalSearchParams();

  const [isLoadingQrCode, setIsLoadingQrCode] = useState(false);

  const validateQrCode = async (qrData: any) => {
    const qrLocation = roundData?.locations.find(
      (l: any) => l.qrCode === qrData
    );

    if (!qrLocation) {
      setIsLoadingQrCode(false);
      return;
    }

    if (
      !canContinueConsecutively({
        currentUuid: uuid as string,
        currentRoundData: roundsListData.filter(
          (x) => x.uuid === roundListDataUuid
        )[0] ?? undefined,
        qrLocation,
      })
    ) {
      console.log("Requiere validar el código qr anterior para continuar");
      Alert.alert("Requiere validar el código qr anterior para continuar");
      setIsLoadingQrCode(false);
      return;
    }

    const dis = getDistance(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      {
        latitude: qrLocation.lat || 0,
        longitude: qrLocation.lng || 0,
      }
    );

    if (dis < 25) {
      await updateLocationStatus({
        roundListDataUuid: roundListDataUuid as string,
        userUuid: user?.uuid ?? "",
        roundDayUuid: uuid as string,
        locationUuid: qrData,
        status: "check",
        checkData: {
          time: new Date().valueOf(),
          currentLocation,
        },
      });
      console.log("Código QR Validado con éxito");
      Alert.alert("Código QR Validado con éxito");
    } else {
      Alert.alert(
        `${qrLocation.name} - ${dis}`,
        "No estas cerca del punto para validar correctamente el código QR"
      );
    }
    setIsLoadingQrCode(false);
  };

  useEffect(() => {
    if (qrCode && uniqueQrCodeInstance) {
      setIsLoadingQrCode(true);
      validateQrCode(qrCode);
    }
  }, [qrCode, uniqueQrCodeInstance]);

  return { isLoadingQrCode };
};

export default useQrValidation;
