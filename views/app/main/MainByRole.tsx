import React, { useEffect } from "react";
import { Text } from "react-native";

import MainAdmin from "./MainAdmin";
import MainGuard from "./MainGuard";
import MainSupervisor from "./MainSupervisor";
import { useUserStore } from "../../../store/auth";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { updateUserToken } from "../../../api/firestore/usersApi";

export type UserType = "guard" | "supervisor" | "admin";

const MainByRole = () => {
  const user = useUserStore((state) => state.user);

  async function onMessageReceived(message: any) {
    if (!message.notification) {
      return;
    }
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId,
        pressAction: {
          id: "default",
        },
      },
    });
  }

  const registerToken = async () => {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();

    updateUserToken({
      userUuid: user?.uuid ?? "",
      token,
    });

    messaging().onMessage(onMessageReceived);

    messaging().setBackgroundMessageHandler(onMessageReceived);
  };

  useEffect(() => {
    registerToken();
  }, []);

  const role = user?.userInformation.role as UserType;

  if (role === "guard") {
    return <MainGuard />;
  }

  if (role === "supervisor") {
    return <MainSupervisor />;
  }

  if (role === "admin") {
    return <MainAdmin />;
  }

  return (
    <Text className=" text-red-800 font-bold text-xl">
      Si ves este mensaje contacta al administrador
    </Text>
  );
};

export default MainByRole;
