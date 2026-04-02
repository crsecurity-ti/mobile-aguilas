import React from "react";
import { Text } from "react-native";

import { RoundsForTheDay } from "../../../types/index";

interface RoundPercentageProps {
  round: RoundsForTheDay;
}

const RoundPercentage = ({ round }: RoundPercentageProps) => {
  const totalRoundPercentage =
    (round.locations.filter((location) => location.status === "check").length *
      100) /
    round.locations.length;

  const getColorByPercentage = (percentage: number) => {
    if (percentage === 100) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    if (percentage >= 30) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Text className={getColorByPercentage(totalRoundPercentage)}>
      {totalRoundPercentage}%
    </Text>
  );
};

export default RoundPercentage;
