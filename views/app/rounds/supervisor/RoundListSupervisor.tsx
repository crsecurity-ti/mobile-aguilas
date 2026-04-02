import { format } from "date-fns";
import { View, Text } from "react-native";

import ListLocations from "./ListLocations";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import useRoundSupervisorList from "../../../../hooks/useRoundSupervisorList";
import NoRounds from "../NoRounds";

const RoundListSupervisor = () => {
  const { roundsListData, roundsListDataLoading } = useRoundSupervisorList();

  if (roundsListDataLoading) return <LoadingSpinner text="Cargando..." />;

  if (
    !roundsListData ||
    !roundsListData[0]?.locations ||
    roundsListData[0]?.locations.length === 0
  )
    return (
      <NoRounds
        title="No tienes rondas asignadas para el dia de hoy"
        description="Consulte con su jefe si no encuentra una ronda asignada."
      />
    );

  return (
    <View className="mx-5 mt-5">
      <Text className="text-center text-2xl font-bold">Ronda del Día</Text>
      <Text className="text-center my-3 text-lg font-semibold text-sky-500">
        {format(new Date(), "yyyy-MM-dd")}
      </Text>
      <ListLocations roundSupervisor={roundsListData[0]} />
    </View>
  );
};

export default RoundListSupervisor;
