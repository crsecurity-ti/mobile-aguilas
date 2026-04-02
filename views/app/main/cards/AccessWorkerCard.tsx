import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

import SimpleCardDS from "../../../../components/SimpleCardDS";
import useAccessWorkerList from "../../../../hooks/useAccessWorkerList";

const AccessWorkerCard = () => {
  const { accessControlWorkerListData } = useAccessWorkerList();
  const router = useRouter();

  return (
    <SimpleCardDS
      onPressButton={() =>
        router.navigate({
          pathname: "/access-worker",
        })
      }
      textButton="Ir a Acceso de Trabajadores"
      body={
        <>
          <Text className="font-bold text-xl pb-2">
            Control de Trabajadores
          </Text>
          <Text>
            Se encuentran actualmente {accessControlWorkerListData?.filter(x => ['in', 'start'].includes(x.status)).length || 0}{" "}
            trabajador
            {(accessControlWorkerListData?.length || 0) > 1 ||
            (accessControlWorkerListData?.length || 0) === 0
              ? "es"
              : ""}{" "}
            en el establecimiento.
          </Text>
        </>
      }
    />
  );
};

export default AccessWorkerCard;
