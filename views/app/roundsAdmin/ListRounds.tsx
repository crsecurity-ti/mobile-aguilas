import "react-native-get-random-values";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, FlatList, Text } from "react-native";
import { v4 as uuidv4 } from "uuid";

import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useRounds from "../../../hooks/useRounds";

const ListRoundsView = () => {
  const router = useRouter();

  const { contractorUuid } = useLocalSearchParams();

  const { rounds, contractorsListDataLoading } = useRounds({
    contractorUuid: contractorUuid as string,
  });

  if (contractorsListDataLoading) {
    return <LoadingSpinner text="Cargando..." />;
  }

  if (rounds.length === 0) {
    return (
      <Text className="my-10 text-center font-bold text-xl">
        No hay contratistas
      </Text>
    );
  }

  return (
    <View className="mx-5">
      <Text className="my-3 text-center mx-5 text-sky-500 text-2xl font-bold h-[7vh]">
        Seleccione una ronda para continuar
      </Text>
      <FlatList
        data={rounds}
        renderItem={({ item }) => (
          <ButtonDS
            className="bg-sky-600"
            key={item.uuid}
            text={item.name}
            onPress={() =>
              router.navigate({
                pathname: "/map-admin",
                params: {
                  roundUuid: item.uuid ?? "",
                  uniqueInstance: uuidv4(),
                },
              })
            }
          />
        )}
        keyExtractor={(item) => item.uuid ?? ""}
      />
    </View>
  );
};

export default ListRoundsView;
