import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import CameraSignIn from "../../components/Camera/CameraSignIn";

const CameraFacialRecognition = () => {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => router.navigate("/sign-in")}
              className="ml-2"
            >
              <Ionicons name="arrow-back" color="white" size={26} />
            </Pressable>
          ),
        }}
      />
      <CameraSignIn />
    </>
  );
};

export default CameraFacialRecognition;
