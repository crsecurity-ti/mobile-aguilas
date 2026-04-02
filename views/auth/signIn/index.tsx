import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

import useSignIn from "./hooks/useSignIn";
import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ButtonDSWithIcon from "../../../components/ButtonDS/ButtonDSWithIcon";
import { useRouter } from "expo-router";

const SignInPage = () => {
  const router = useRouter();

  const { loading, onPressLogin, control, handleSubmit } = useSignIn();

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
