import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text } from "react-native";
import Toast from "react-native-toast-message";
import { twMerge } from "tailwind-merge";

import { useUserStore } from "../../../../store/auth";
import { useLastPositionStore } from "../../../../store/location";
import { RoundsForTheDay } from "../../rounds/types";
import { updateRoundTimeDb } from "../../../../api/firestore/roundsByDaysApi";
import useLocationTracking from "../hooks/useLocationTracking";

interface RoundButtonProps {
  roundListDataUuid: string;
  roundByDayData: RoundsForTheDay;
  type: "start" | "end";
}

const RoundButton = ({
  roundListDataUuid,
  roundByDayData,
  type,
}: RoundButtonProps) => {
  const user = useUserStore((state) => state.user);

  const { startTracking, stopTracking } = useLocationTracking();

  const lastPosition = useLastPositionStore((state) => state.lastPosition);

  const router = useRouter();

  const updateRoundTime = useCallback(async () => {
    if (type === "start") {
      Toast.show({
        type: "success",
        text1: "Ronda Iniciada",
        text2: "Felicitaciones, iniciaste con éxito la ronda",
      });
      await startTracking();
      return await updateRoundTimeDb({
        roundListDataUuid,
        roundDayUuid: roundByDayData.uuid,
        startRound: {
          time: new Date().toISOString(),
          location: lastPosition,
        },
        userUuid: user?.uuid as string,
      });
    }
    Toast.show({
      type: "success",
      text1: "Ronda Finalizada",
      text2: "Felicitaciones, finalizaste con éxito la ronda",
    });
    await stopTracking();
    await updateRoundTimeDb({
      roundListDataUuid,
      roundDayUuid: roundByDayData.uuid,
      endRound: {
        time: new Date().toISOString(),
        location: lastPosition,
      },
      userUuid: user?.uuid as string,
    });
    router.navigate("/rounds");
  }, [
    roundListDataUuid,
    roundByDayData,
    type,
    lastPosition,
    user,
    startTracking,
    stopTracking,
    router,
  ]);

  const isDisabled =
    (roundByDayData.startRound.time !== "" && type === "start") ||
    (roundByDayData.endRound.time !== "" && type === "end") ||
    (roundByDayData.locations.filter((l) => l.status === "pending").length !==
      0 &&
      type === "end");

  return (
    <Pressable
      onPress={updateRoundTime}
      className={twMerge(
        "m-2 bg-sky-600 p-4 rounded-md",
        isDisabled ? "opacity-50" : "opacity-100"
      )}
      disabled={isDisabled}
    >
      <Text
        className={twMerge(
          "font-bold text-center",
          isDisabled ? "text-gray-600" : "text-white"
        )}
      >
        {type === "start"
          ? roundByDayData.startRound.time !== ""
            ? "Ronda Iniciada"
            : "Iniciar Ronda"
          : null}
        {type === "end"
          ? roundByDayData.endRound.time !== ""
            ? "Ronda Finalizada"
            : "Finalizar Ronda"
          : null}
      </Text>
    </Pressable>
  );
};

export default React.memo(RoundButton);
