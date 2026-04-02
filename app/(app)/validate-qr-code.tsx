import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable } from "react-native";
import * as Location from "expo-location";

import { useUserStore } from "../../store/auth";
import BarCodeContainer from "../../components/BarCode/BarCodeContainer";
import { validateAndUpdateQrCode } from "../../api/firestore/qrCodesApi";

const CameraSupervisor = () => {
  const router = useRouter();
  const { roundUuid } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);

  const validateQRCode = async (qrData: any) => {
    try {
      const location = await Location.getCurrentPositionAsync({});

      if (user?.userInformation.role === "supervisor") {
        const errors = [];
        const success = [];
        for (const contractor of user?.userInformation?.contractors) {
          const err = await validateAndUpdateQrCode({
            userUuid: user?.uuid ?? "",
            currentLocation: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            businessUuid:
              user?.businessUuid ?? user?.userInformation?.businessUuid ?? "",
            contractorUuid: contractor,
            qrCodeUuid: qrData,
          });
          if (err?.err) {
            errors.push(err.message);
          } else {
            success.push(err.message);
          }
        }
        if (success.length > 0) {
          alert("Código QR validado correctamente");
        }
        router.navigate({
          pathname: "/qr-code-list",
          params: { roundUuid },
        });
        return;
      }
      const err = await validateAndUpdateQrCode({
        userUuid: user?.uuid ?? "",
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        businessUuid:
          user?.businessUuid ?? user?.userInformation?.businessUuid ?? "",
        contractorUuid: user?.userInformation?.contractorUuid ?? "",
        qrCodeUuid: qrData,
      });
      if (err?.err) {
        alert(err.message);
      } else {
        alert("Código QR validado correctamente");
      }
      router.navigate({
        pathname: "/qr-code-list",
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
                    pathname: "/qr-code-list",
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
