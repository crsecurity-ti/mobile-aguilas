import { Text } from "react-native";
import useRoundGuardsByDay from "../../../../hooks/useRoundGuardsByDay";

const TotalGuardPercentageCard = () => {
  const { roundsListDataLoading, roundsListData } = useRoundGuardsByDay();

  if (roundsListDataLoading) return <Text>Cargando ...</Text>;

  if (!roundsListData || roundsListData.length === 0)
    return <Text>No tiene rondas asignadas para hoy</Text>;

  const totalLocations = roundsListData.reduce(
    (acc, roundListData) =>
      acc +
      roundListData.roundsForTheDay.reduce(
        (subAcc, round) => subAcc + round.locations.length,
        0
      ),
    0
  );

  if (totalLocations === 0)
    return <Text>No tiene rondas asignadas para hoy</Text>;

  const totalCheckedPositions = roundsListData.reduce(
    (acc, roundListData) =>
      acc +
      roundListData.roundsForTheDay.reduce(
        (subAcc, round) =>
          subAcc +
          round.locations.filter((location) => location.status === "check")
            .length,
        0
      ),
    0
  );

  const totalRoundPercentage = (totalCheckedPositions / totalLocations) * 100;

  return <Text>Total cumplido {totalRoundPercentage.toFixed(2)}%</Text>;
};

export default TotalGuardPercentageCard;
