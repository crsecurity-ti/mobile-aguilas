import React from "react";
import { Text, FlatList } from "react-native";

import useAccessControlHistorial from "../../../../hooks/useAccessControlHistorial";
import AccessItemDS from "../components/AccessItemDS";

const AccessHistorialView = () => {
  const { accessControlList } = useAccessControlHistorial();

  const renderItem = ({ item }: { item: any }) => (
    <AccessItemDS accessControl={item} onPress={() => {}} type="historial" />
  );

  return (
    <>
      <Text className="text-center font-bold text-lg my-10 mx-4">
        En esta pagina salen las ultimas 24 horas de registros.
      </Text>
      <FlatList
        className="h-5/6"
        data={accessControlList}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
      />
    </>
  );
};

export default AccessHistorialView;
