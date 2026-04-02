import React from "react";
import { Image, Modal, Platform, Text, View } from "react-native";
import ButtonDS from "../../../components/ButtonDS";

const LocationPermissionModal = ({
  isOpen,
  setIsOpen,
  onAccept,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onAccept: () => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      <View className="flex-1 bg-white h-full w-full">
        <View className="justify-center align-center my-10">
          <View className="my-4 justify-center items-center">
            <Image
              style={{ width: 300, height: 300 }}
              alt="entrance"
              source={require("../../../assets/images/location.png")}
            />
          </View>
        </View>
        <Text className="text-center font-bold text-3xl text-gray-800 my-5">Habilitar la ubicación</Text>
        <Text className="text-center mx-10 font-semibold text-gray-700 my-10">
          Requerimos de la ubicación para poder hacer seguimiento correcto del
          movimiento dentro de cada una de las instalaciones, como también poder
          validar correctamente los códigos QR y hacer uso correcto del
          aplicativo.
        </Text>
        <View className="mx-10">
          <ButtonDS text="Continue" onPress={onAccept} />
          {Platform.OS === "android" && (
            <ButtonDS text="Quizás Después" onPress={() => setIsOpen(false)} intent="outline" />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LocationPermissionModal;
