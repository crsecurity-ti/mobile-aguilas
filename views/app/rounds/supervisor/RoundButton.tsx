import React, { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Toast from "react-native-toast-message";
import { twMerge } from "tailwind-merge";

import { RoundSupervisor } from "./types";
import { useUserStore } from "../../../../store/auth";
import { useLastSupervisorRoundStore } from "../../../../store/lastSupervisorRound";
import { updateRoundSupervisorTimeDb } from "../../../../api/firestore/roundsSupervisorApi";
import useLocationTrackingSupervisor from "./hooks/useLocationTrackingSupervisor";

interface RoundButtonProps {
  roundSupervisor: RoundSupervisor;
  type: "start" | "end";
}

const RoundButton = ({ roundSupervisor, type }: RoundButtonProps) => {
  const user = useUserStore((state) => state.user);

  const { startTracking, stopTracking } = useLocationTrackingSupervisor();

  const setLastSupervisorRound = useLastSupervisorRoundStore(
    (state) => state.setLastSupervisorRound
  );

  useEffect(() => {
    setLastSupervisorRound({ uuid: roundSupervisor.uuid });
  }, [roundSupervisor.uuid]);

  const updateRoundTime = async () => {
    if (type === "start") {
      Toast.show({
        type: "success",
        text1: "Ronda Iniciada",
        text2: "Felicitaciones, iniciaste con éxito la ronda",
      });
      setLastSupervisorRound({ uuid: roundSupervisor.uuid });
      await startTracking();
      return await updateRoundSupervisorTimeDb({
        roundUuid: roundSupervisor.uuid,
        startRound: {
          time: new Date().toISOString(),
        },
        userUuid: user?.uuid ?? "",
      });
    }

    Toast.show({
      type: "success",
      text1: "Ronda Finalizada",
      text2: "Felicitaciones, finalizaste con éxito la ronda",
    });
    await stopTracking();
    await updateRoundSupervisorTimeDb({
      roundUuid: roundSupervisor.uuid,
      endRound: {
        time: new Date().toISOString(),
      },
      userUuid: user?.uuid ?? "",
    });
  };

  const isDisabled =
    (roundSupervisor.startRound?.time !== "" && type === "start") ||
    (roundSupervisor.endRound?.time !== "" && type === "end") ||
    (roundSupervisor.locations.filter((l) => l.status === "pending").length !==
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
          ? roundSupervisor.startRound?.time !== ""
            ? "Ronda Iniciada"
            : "Iniciar Ronda"
          : null}
        {type === "end"
          ? roundSupervisor.endRound?.time !== ""
            ? "Ronda Finalizada"
            : "Finalizar Ronda"
          : null}
      </Text>
    </Pressable>
  );
};

export default RoundButton;
