import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import UpdatedCamera from "../../components/Camera/UpdatedCamera";

const SimpleCamera = () => {
  const router = useRouter();
  const { from, task } = useLocalSearchParams();

  const extraParams = {
    task: task,
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.navigate({
                  pathname:
                    from === "todo-simple" ? "/todo-simple" : "/new-event",
                  params: {
                    photo: "",
                    ...extraParams,
                  },
                });
              }}
              className="ml-2"
            >
              <Ionicons name="arrow-back" color="white" size={26} />
            </Pressable>
          ),
        }}
      />
      <UpdatedCamera
        from={from === "todo-simple" ? "/todo-simple" : "/new-event"}
        extraParams={extraParams}
      />
    </>
  );
};

export default SimpleCamera;
