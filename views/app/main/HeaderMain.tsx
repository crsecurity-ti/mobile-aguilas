import React from "react";
import { Text, View } from "react-native";
import { useUserStore } from "../../../store/auth";

const HeaderMain = () => {
  const user = useUserStore((state) => state.user);
  
  return (
    <View className="flex justify-center h-1/6">
      <Text className="text-2xl font-bold text-center">
        Bienvenido a<Text className="text-emerald-500"> Aguilas Seguridad</Text>
      </Text>
      <Text className="font-medium mt-3 text-center">
        Desde esta sección podrás revisar todo.
      </Text>
      <Text className="mt-3 text-center font-medium text-xs">
        {user?.userInformation?.email} - {user?.userInformation?.displayName}
      </Text>
    </View>
  );
};

export default HeaderMain;
