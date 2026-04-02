import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { callPanicApi } from "../../../../api/panicApi";
import { useUserStore } from "../../../../store/auth";

const PanicButton = () => {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const callPanic = async () => {
    Alert.alert(
      "Boton de Panico",
      "Estas seguro que deseas enviar una alerta de panico?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Enviar", style: "destructive", onPress: sendPanic },
      ]
    );
  };

  const sendPanic = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let latitude = 0;
      let longitude = 0;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      }

      await callPanicApi({
        userUuid: user?.uuid ?? "",
        latitude,
        longitude,
      });

      Toast.show({
        type: "success",
        text1: "Notificacion de panico enviada",
        text2: "Se envio la notificacion de panico correctamente",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo enviar la notificacion de panico",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mx-10 my-2">
      <Pressable
        className="flex flex-row rounded-md text-center p-4 bg-red-700 justify-center items-center"
        onPress={callPanic}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons name="notifications-outline" size={16} color="white" />
            <Text className="text-white pl-2">Boton de panico</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

export default PanicButton;
