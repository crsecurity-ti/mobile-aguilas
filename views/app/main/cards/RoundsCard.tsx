import { format } from "date-fns";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

import TotalGuardPercentageCard from "./TotalGuardPercentageCard";
import TotalRoundSupervisorPercentageCard from "./TotalRoundSupervisorPercentageCard";
import SimpleCardDS from "../../../../components/SimpleCardDS";

const RoundsCard = ({ role }: { role: "guard" | "supervisor" }) => {
  const router = useRouter();

  return (
    <SimpleCardDS
      onPressButton={() =>
        router.navigate({
          pathname: "/rounds",
        })
      }
      textButton="Ir a mis Rondas"
      body={
        <>
          <Text className="font-bold text-xl pb-2">
            Detalle de las Rondas de Hoy
          </Text>
          <Text className="text-sm text-violet-500 font-semibold pb-2">
            Rondas del dia {format(new Date(), "yyyy-MM-dd")}.
          </Text>
          {role === "guard" ? (
            <TotalGuardPercentageCard />
          ) : (
            <TotalRoundSupervisorPercentageCard />
          )}
        </>
      }
    />
  );
};

export default RoundsCard;
