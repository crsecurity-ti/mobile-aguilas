import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Round } from "../../../types";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { v4 as uuidv4 } from "uuid";
import { RoundGuard } from "../rounds/types";
import useLocationTracking from "./hooks/useLocationTracking";

export interface MainHeaderProps {
  roundData: Round;
  roundsListData: RoundGuard[];
}

const MainHeader = ({ roundData, roundsListData }: MainHeaderProps) => {
  const { uuid, roundUuid, roundListDataUuid } = useLocalSearchParams();
  const { unregisterTask, removeLocationSubscription } = useLocationTracking();

  const isCameraDisabled =
    roundsListData
      .filter((x) => x.uuid === roundListDataUuid)[0]
      ?.roundsForTheDay.filter(
        (roundByDay) => roundByDay.uuid === uuid
      )[0].startRound.time == "";

  return (
    <Stack.Screen
      options={{
        title: roundData.name,
        headerLeft: () => (
          <Pressable
            onPress={async () => {
              removeLocationSubscription();

              await unregisterTask();
              if (router.canDismiss()) {
                router.dismissAll();
              }

              if (router.canGoBack()) {
                router.back();
              }
              try {
                router.navigate("/rounds");
              } catch (e) {
                console.log(e);
              }
            }}
            className="ml-2"
          >
            <Ionicons name="arrow-back" color="white" size={26} />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable
            className="mr-4"
            onPress={() =>
              router.navigate({
                pathname: "/camera",
                params: {
                  uuid,
                  roundUuid,
                  roundListDataUuid: roundListDataUuid as string,
                  uniqueInstance: uuidv4(),
                  locationsData: roundData.locations.map(
                    (l) =>
                      ({
                        qrCode: l.qrCode,
                        lat: l.lat,
                        lng: l.lng,
                      }) as any
                  ),
                },
              })
            }
            disabled={isCameraDisabled}
          >
            <Ionicons
              name="camera"
              color={isCameraDisabled ? "#737373" : "white"}
              size={24}
            />
          </Pressable>
        ),
      }}
    />
  );
};

export default MainHeader;
