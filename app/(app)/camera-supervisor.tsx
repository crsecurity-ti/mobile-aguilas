import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable } from "react-native";
import * as Location from "expo-location";

import { useUserStore } from "../../store/auth";
import BarCodeContainer from "../../components/BarCode/BarCodeContainer";
import { updateRoundSupervisorStatusDb } from "../../api/firestore/roundsSupervisorApi";
import Toast from "react-native-toast-message";

const CameraSupervisor = () => {
  const router = useRouter();
  const { roundUuid } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);

  const validateQRCode = async (qrData: any) => {
    try {
      const location = await Location.getCurrentPositionAsync({});

      const err = await updateRoundSupervisorStatusDb({
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        userUuid: user?.uuid ?? "",
        qrCode: qrData,
        roundUuid: roundUuid as string,
        status: "check",
        checkData: {
          time: new Date().valueOf(),
        },
      });
      if (err?.msg) {
        if (err.msg === "DISTANCE_ERROR") {
          alert(
            "No se puede validar el código qr, la distancia es mayor a 25 metros"
          );
        }
        if (err.msg === "INVALID_CONSECUTIVE") {
          alert(
            "No se puede validar el código qr, tiene que validar el anterior primero"
          );
        }
      } else {
        Toast.show({
          text1: "Código qr validado correctamente",
        });
      }
      router.navigate({
        pathname: "/rounds",
        params: { roundUuid },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <>
              <Pressable
                onPress={() =>
                  router.navigate({
                    pathname: "/rounds",
                    params: { roundUuid },
                  })
                }
                className="ml-2"
              >
                <Ionicons name="arrow-back" color="white" size={26} />
              </Pressable>
            </>
          ),
        }}
      />
      <BarCodeContainer validateQRCode={validateQRCode} />
    </>
  );
};

export default CameraSupervisor;
