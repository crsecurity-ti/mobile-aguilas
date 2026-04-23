import { Controller } from "react-hook-form";
import { Alert, Text, TextInput, View } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useSignIn from "./hooks/useSignIn";
import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ButtonDSWithIcon from "../../../components/ButtonDS/ButtonDSWithIcon";
import { useRouter } from "expo-router";

const LOCATION_DISCLOSURE_KEY = "location_disclosure_shown";

const SignInPage = () => {
  const router = useRouter();

  const { loading, onPressLogin, control, handleSubmit } = useSignIn();

  useEffect(() => {
    const showLocationDisclosure = async () => {
      const shown = await AsyncStorage.getItem(LOCATION_DISCLOSURE_KEY);
      if (shown) return;
      Alert.alert(
        "Uso de ubicación en segundo plano",
        "Águilas Seguridad registra tu ubicación GPS durante las rondas de seguridad, " +
          "incluso cuando la aplicación está en segundo plano o la pantalla está apagada.\n\n" +
          "Esta información se usa exclusivamente para verificar el cumplimiento de las " +
          "rondas y supervisar los recorridos en tiempo real.",
        [
          {
            text: "Entendido",
            onPress: () => AsyncStorage.setItem(LOCATION_DISCLOSURE_KEY, "true"),
          },
        ]
      );
    };
    showLocationDisclosure();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Verificando información de acceso..." />;
  }

  return (
    <View className="flex justify-center w-full h-full bg-white">
      <View className="flex-col mx-5">
        <Text className="text-center font-bold text-sky-600 text-3xl">
          Bienvenido a Águilas Seguridad
        </Text>
        <Text className="text-center text-gray-600 font-semibold pt-3">
          Ingresa tus datos para continuar
        </Text>

        <View className="mt-5 space-y-3">
          <View>
            <Text className="text-gray-600 text-md">Correo Electrónico</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-md p-2 mt-2"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
          </View>
          <View className="mt-4">
            <Text className="text-gray-600 text-md pb-2">Password</Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-md p-2 my-2"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
              name="password"
            />
          </View>
          <View className="mt-4">
            <ButtonDS onPress={handleSubmit(onPressLogin)} text="Ingresar" />
          </View>
          <View className="mt-8 mb-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-900 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-900 ">
            <Text className="mx-4 mb-0 text-center font-semibold ">
              o realiza login con
            </Text>
          </View>

          <ButtonDSWithIcon
            onPress={() => {
              router.navigate({
                pathname: "/camera-facial-recognition",
              });
            }}
            text="Reconocimiento Facial"
          />
        </View>
      </View>
    </View>
  );
};

export default SignInPage;
