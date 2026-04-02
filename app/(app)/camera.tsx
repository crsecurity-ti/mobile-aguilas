import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { v4 as uuidv4 } from "uuid";

import BarCodeContainer from "../../components/BarCode/BarCodeContainer";

const Camera = () => {
  const router = useRouter();
  const { uuid, roundUuid, roundListDataUuid, from } = useLocalSearchParams();

  const validateQrCode = async (data: string) => {
    const newUuid = uuidv4();
    if (from === "main") {
      return router.navigate({
        pathname: "/home",
        params: {
          qrCode: data,
          uniqueQrCodeInstance: newUuid,
        },
      });
    }
    router.navigate({
      pathname: "/map",
      params: {
        uuid,
        roundUuid,
        roundListDataUuid,
        qrCode: data,
        uniqueQrCodeInstance: newUuid,
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <>
              <Pressable
                onPress={() =>
                  from === "main"
                    ? router.navigate({
                        pathname: "/home",
                        params: {
                          uniqueQrCodeInstance: uuidv4(),
                        },
                      })
                    : router.navigate({
                        pathname: "/map",
                        params: { uuid, roundUuid },
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
      <BarCodeContainer validateQRCode={validateQrCode} />
    </>
  );
};

export default Camera;
