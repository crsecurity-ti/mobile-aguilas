import { isAfter, isBefore, setHours, setMinutes, addMinutes } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert, Text, View } from "react-native";

import { useUserStore } from "../../../../store/auth";
import Toast from "react-native-toast-message";
import ButtonDS from "../../../../components/ButtonDS";
import NFCButton from "./NFCButton";
import { getDistance } from "geolib";
import {
  createHourManagementInFirestore,
  updateHourManagementInFirestore,
} from "../../../../api/firestore/hourManagementApi";
import useHourManagementSupervisor from "../../../../hooks/useHourManagementSupervisor";
import useContractors from "../../../../hooks/useContractors";

const HourManagementCard = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const { hourManagementData, loading: hourManagementLoading } =
    useHourManagementSupervisor({
      businessUuid: user?.userInformation.businessUuid as string,
      userUuid: user?.uuid as string,
    });

  const { contractors, contractorsListDataLoading } = useContractors();

  const { qrCode, uniqueQrCodeInstance } = useLocalSearchParams();

  const startHour = async () => {
    await createHourManagementInFirestore({
      businessUuid: user?.userInformation.businessUuid as string,
      userUuid: user?.uuid as string,
      type: "supervisor",
    });
    Toast.show({
      type: "info",
      text1: "Iniciado turno con éxito",
      text2: "Se realizo el inicio de turno con éxito",
    });
    setLoading(false);
  };

  const endHour = async () => {
    await updateHourManagementInFirestore({
      businessUuid: user?.userInformation.businessUuid as string,
      hourManagementUuid:
        (hourManagementData?.find((hourManagement) =>
          isAfter(
            addMinutes(
              new Date(hourManagement.startHour),
              user?.userInformation.hourTrackingConfiguration?.maxShiftTime ?? 0
            ),
            new Date()
          )
        )?.uuid as string) ?? hourManagementData?.[0]?.uuid,
      endHour: new Date().getTime(),
      type: "supervisor",
    });
    Toast.show({
      type: "info",
      text1: "Finalizado turno con éxito",
      text2: "Se realizo la finalización de turno con éxito",
    });
    setLoading(false);
  };

  const validateQrCode = async (qrCode: string) => {
    if (contractors.find((contractor) => contractor.qrCode === qrCode)) {
      startHour();
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Código QR no valido",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (qrCode && uniqueQrCodeInstance) {
      setLoading(true);
      validateQrCode(qrCode as string);
    } else if (uniqueQrCodeInstance) {
      setLoading(false);
    }
  }, [qrCode, uniqueQrCodeInstance]);

  const onPressButton = async () => {
    setLoading(true);
    const enableShiftLimitStart =
      user?.userInformation.hourTrackingConfiguration?.enableShiftLimitStart;

    if (enableShiftLimitStart) {
      const [hours, minutes] = enableShiftLimitStart.split(":").map(Number);

      const shiftStartTime = setMinutes(setHours(new Date(), hours), minutes);

      const isAfterStart = isAfter(new Date(), shiftStartTime);

      if (!isAfterStart) {
        Alert.alert("No se puede iniciar el turno antes de la hora de inicio");
        setLoading(false);
        return;
      }
    }

    const enableShiftLimitEnd =
      user?.userInformation.hourTrackingConfiguration?.enableShiftLimitEnd;

    if (enableShiftLimitEnd) {
      const [hours, minutes] = enableShiftLimitEnd.split(":").map(Number);

      const shiftEndTime = setMinutes(setHours(new Date(), hours), minutes);

      const isBeforeEnd = isBefore(new Date(), shiftEndTime);

      if (!isBeforeEnd) {
        Alert.alert("No se puede iniciar el turno después de la hora de fin");
        setLoading(false);
        return;
      }
    }

    if (user?.userInformation.hourTrackingConfiguration?.enableGPS) {
      const location = await Location.getCurrentPositionAsync({});

      const dis = getDistance(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        {
          latitude:
            contractors.find((contractor) => contractor.qrCode === qrCode)
              ?.lat || 0,
          longitude:
            contractors.find((contractor) => contractor.qrCode === qrCode)
              ?.lng || 0,
        }
      );
      if (dis > 25) {
        Alert.alert(
          "No estas cerca de la instalación para validar correctamente inicio de turno"
        );
        setLoading(false);
        return;
      }
    }

    if (user?.userInformation.hourTrackingConfiguration?.enableQR) {
      return router.navigate({
        pathname: "/camera",
        params: {
          from: "main",
        },
      });
    }

    startHour();
  };

  const isShiftStarted = hourManagementData?.some((hourManagement) => {
    if (
      !user?.userInformation.hourTrackingConfiguration?.maxShiftTime ||
      user?.userInformation.hourTrackingConfiguration?.maxShiftTime === 0
    ) {
      return true;
    }

    return isAfter(
      addMinutes(
        new Date(hourManagement.startHour),
        user?.userInformation.hourTrackingConfiguration?.maxShiftTime ?? 0
      ),
      new Date()
    );
  });

  if (!user || !user.userInformation.enableHourTracking) return null;

  return (
    <View className="mx-2 mb-1">
      <View className="bg-white border border-gray-200 rounded-lg p-2">
        <Text className="font-bold text-xl pb-2">
          Aun no ha iniciado su turno.
        </Text>
        <Text className="text-sm text-violet-500 font-semibold pb-2">
          Aun no ha iniciado su turno, favor de iniciar su turno.
        </Text>
        {isShiftStarted ? (
          <ButtonDS
            text="Finalizar Turno"
            className="p-3 font-bold"
            onPress={endHour}
          />
        ) : user?.userInformation.hourTrackingConfiguration?.enableNFC ? (
          <NFCButton
            nfcCode={contractors.map((contractor) => contractor.nfcCode)}
            callback={onPressButton}
          />
        ) : (
          <ButtonDS
            text={
              hourManagementLoading
                ? "Cargando ..."
                : loading
                  ? "Iniciando Turno..."
                  : "Iniciar Turno"
            }
            className="p-3 font-bold"
            onPress={onPressButton}
            disabled={
              loading || contractorsListDataLoading || hourManagementLoading
            }
          />
        )}
      </View>
    </View>
  );
};

export default HourManagementCard;
