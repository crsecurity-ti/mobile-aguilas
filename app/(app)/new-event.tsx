import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import MainLayout from "../../components/MainLayout";
import { useUserStore } from "../../store/auth";
import NewEventView from "../../views/app/newEvent";

const NewEvent = () => {
  const user = useUserStore((state) => state.user);

  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <>
              <Pressable
                onPress={() =>
                  router.navigate(
                    user?.userInformation.role === "supervisor"
                      ? "/events-supervisor"
                      : "/events",
                  )
                }
                className="ml-2"
              >
                <Ionicons name="arrow-back" color="white" size={26} />
              </Pressable>
            </>
          ),
        }}
      />
      <NewEventView />
    </MainLayout>
  );
};

export default NewEvent;
