import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import AccessPersonalScannerView from "../../views/app/access/scanner";

const AccessPersonalScannerScreen = () => {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <>
              <Pressable
                onPress={() => router.navigate("/access")}
                className="ml-2"
              >
                <Ionicons name="arrow-back" color="white" size={26} />
              </Pressable>
            </>
          ),
        }}
      />
      <AccessPersonalScannerView />
    </>
  );
};

export default AccessPersonalScannerScreen;
