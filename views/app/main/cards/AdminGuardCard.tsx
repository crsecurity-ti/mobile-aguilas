import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

import SimpleCardDS from "../../../../components/SimpleCardDS";

const AdminGuardCard = () => {
  const router = useRouter();

  return (
    <SimpleCardDS
      onPressButton={() =>
        router.navigate({
          pathname: "/list-contractors",
        })
      }
      textButton="Ir a instalaciones de Personal"
      body={
        <>
          <Text className="font-bold text-xl pb-2">Personal</Text>
          <Text>Revisar Rondas por Instalaciones</Text>
        </>
      }
    />
  );
};

export default AdminGuardCard;
