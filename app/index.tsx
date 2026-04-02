import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";

import { useAuthentication } from "../hooks/useAuthentication";
import "expo-router/entry";

export default function MainScreen() {
  const { user } = useAuthentication();

  if (!user) {
    return <Redirect href="/signIn" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
  );
}
