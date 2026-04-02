import React from "react";
import { Text } from "react-native";

import useRoundSupervisorList from "../../../../hooks/useRoundSupervisorList";

const TotalRoundSupervisorPercentageCard = () => {
  const { roundsListData, roundsListDataLoading } = useRoundSupervisorList();

  const currentLocationsLength =
    roundsListData?.reduce((acc, curr) => acc + curr.locations.length, 0) ?? 0;

  if (roundsListDataLoading) return <Text>Cargando ...</Text>;

  if (currentLocationsLength === 0)
    return <Text>No tiene rondas asignadas para hoy</Text>;

  const currentCheckPositions =
    roundsListData?.reduce(
      (acc, curr) =>
        acc +
        curr.locations.filter((location) => location.status === "check").length,
      0,
    ) ?? 0;

  const totalRoundPercentage =
    (currentCheckPositions / currentLocationsLength) * 100;

  return <Text>Total cumplido {totalRoundPercentage.toFixed(2)}%</Text>;
};

export default TotalRoundSupervisorPercentageCard;
