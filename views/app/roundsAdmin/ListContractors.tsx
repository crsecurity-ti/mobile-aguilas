import "react-native-get-random-values";
import { useRouter } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { v4 as uuidv4 } from "uuid";

import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useContractors from "../../../hooks/useContractors";

const ListContractorsView = ({ pathname }: { pathname: string }) => {
  const { contractors, contractorsListDataLoading } = useContractors();
  const router = useRouter();

  if (contractorsListDataLoading) return <LoadingSpinner />;

  if (contractors.length === 0)
    return (
      <Text className="my-10 text-center font-bold text-xl">
        No hay contratistas
      </Text>
    );

  return (
    <View className="mx-5 flex-1">
      <Text className="my-3 text-center mx-5 text-sky-500 text-2xl font-bold h-[7vh]">
        Seleccione una instalación para continuar
      </Text>
      <FlatList
        className="h-[85vh]"
        data={contractors}
        renderItem={({ item }) => (
          <ButtonDS
            className="bg-sky-600"
            key={item.uuid}
            text={item.name}
            onPress={() =>
              router.navigate({
                pathname,
                params: {
                  contractorUuid: item.uuid ?? "",
                  uniqueInstance: uuidv4(),
                },
              })
            }
          />
        )}
        keyExtractor={(item: any) => item.uuid}
      />
    </View>
  );
};

export default ListContractorsView;
