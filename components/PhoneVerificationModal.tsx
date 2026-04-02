import { Modal, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import ButtonDS from "./ButtonDS";
import { useUserStore } from "../store/auth";

const PhoneVerificationModal = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  // No mostrar para super-admin
  if (user?.userInformation?.role === "super-admin") {
    return null;
  }

  // No mostrar si ya tiene telefono verificado
  if (user?.userInformation?.phoneVerified) {
    return null;
  }

  const onVerifyPhone = () => {
    router.push("/profile");
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl p-6 mx-5 w-11/12">
          <Text className="text-xl font-bold text-sky-600 text-center mb-4">
            Verificacion Requerida
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Para continuar usando la aplicacion, necesitas verificar tu numero
            de telefono.
          </Text>
          <ButtonDS onPress={onVerifyPhone} text="Verificar Ahora" />
        </View>
      </View>
    </Modal>
  );
};

export default PhoneVerificationModal;
