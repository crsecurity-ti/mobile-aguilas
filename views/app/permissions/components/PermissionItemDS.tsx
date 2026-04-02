import React from "react";
import { Text, View } from "react-native";

import PermissionBadge from "./PermissionBadge";
import ButtonDS from "../../../../components/ButtonDS";

const PermissionItemDS = ({
  title,
  subtitle,
  buttonText,
  permission,
  requestPermission,
  canAskAgain = true,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  permission: any;
  requestPermission: any;
  canAskAgain?: boolean;
}) => {
  return (
    <View className="p-4 my-2 border border-gray-300 rounded-lg bg-white">
      <Text className="font-bold text-2xl mb-2">
        {title} -{" "}
        <PermissionBadge
          loading={!permission}
          status={permission?.status ?? "undetermined"}
        />
      </Text>
      <Text className="text-sm font-semibold text-violet-500 mb-2">
        {subtitle}
      </Text>
      {permission && !permission?.granted && canAskAgain ? (
        <ButtonDS onPress={requestPermission} text={buttonText} />
      ) : !canAskAgain && !permission?.granted ? (
        <Text className="font-semibold">
          Este permiso no puede ser solicitado de nuevo, por favor configura el
          permiso en la configuración de la app.
        </Text>
      ) : (
        <Text className="font-semibold">
          Este permiso está funcionando correctamente.
        </Text>
      )}
    </View>
  );
};

export default PermissionItemDS;
