import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

import SimpleCardDS from "../../../../components/SimpleCardDS";
import useAccessControl from "../../../../hooks/useAccessControl";

const AccessCard = () => {
  const { accessControlList } = useAccessControl();
  const router = useRouter();

  return (
    <>
      <SimpleCardDS
        onPressButton={() =>
          router.navigate({
            pathname: "/access",
          })
        }
        textButton="Ir a Acceso de Externo"
        body={
          <>
            <Text className="font-bold text-xl pb-2">
              Control de Acceso Externo
            </Text>
            <Text>
              Se encuentran actualmente {accessControlList?.length || 0} externo
              {(accessControlList?.length || 0) > 1 ||
              (accessControlList?.length || 0) === 0
                ? "s"
                : ""}{" "}
              en el establecimiento.
            </Text>
          </>
        }
      />
    </>
  );
};

export default AccessCard;
