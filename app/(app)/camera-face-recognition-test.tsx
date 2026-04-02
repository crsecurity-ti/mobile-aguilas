import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { v4 as uuidv4 } from "uuid";

import CameraTestFaceRecognition from "../../components/Camera/CameraTestFaceRecognition";

const CameraFaceRecognitionTestPage = () => {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <>
              <Pressable
                onPress={() =>
                  router.navigate({
                    pathname: "/home",
                    params: {
                      uniqueQrCodeInstance: uuidv4(),
                    },
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
      <CameraTestFaceRecognition />
    </>
  );
};

export default CameraFaceRecognitionTestPage;
