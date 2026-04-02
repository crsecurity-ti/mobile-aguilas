import { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, View, Pressable, ScrollView } from "react-native";

import usePhoneVerification from "./hooks/usePhoneVerification";
import useEmailVerification from "./hooks/useEmailVerification";
import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useUserStore } from "../../../store/auth";

type ActiveSection = "phone" | "email" | null;

const ProfilePage = () => {
  const user = useUserStore((state) => state.user);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  const phoneVerif = usePhoneVerification({ onComplete: () => setActiveSection(null) });
  const emailVerif = useEmailVerification({ onComplete: () => setActiveSection(null) });

  const phoneVerified =
    (user?.userInformation?.phoneVerified || phoneVerif.step === "verified") &&
    activeSection !== "phone";
  const emailVerified =
    (user?.userInformation?.emailVerified || emailVerif.step === "verified") &&
    activeSection !== "email";

  if (phoneVerif.loading || emailVerif.loading) {
    return <LoadingSpinner text="Procesando..." />;
  }

  // Flujo activo: verificacion de telefono - input
  if (activeSection === "phone" && !phoneVerified && phoneVerif.step === "input") {
    return (
      <View className="flex-1 bg-white p-5 pt-2">
        <Pressable onPress={() => setActiveSection(null)} className="mb-8">
          <Text className="text-sky-600 text-base">Volver</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-sky-600 text-center mb-2">
          {user?.userInformation?.phoneVerified ? "Cambiar Telefono" : "Verificacion de Telefono"}
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          {user?.userInformation?.phoneVerified
            ? "Ingresa tu nuevo numero de telefono"
            : "Ingresa tu numero de telefono para verificarlo"}
        </Text>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Numero de Telefono</Text>
          <Controller
            control={phoneVerif.phoneForm.control}
            rules={{
              required: "El numero es requerido",
              pattern: {
                value: /^\+?[1-9]\d{8,14}$/,
                message: "Formato invalido. Ej: +56912345678",
              },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 text-lg"
                  placeholder="+56912345678"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && (
                  <Text className="text-red-500 mt-1">{error.message}</Text>
                )}
              </>
            )}
            name="phoneNumber"
          />
        </View>

        <ButtonDS
          onPress={phoneVerif.phoneForm.handleSubmit(phoneVerif.onSendOtp)}
          text="Enviar Codigo"
        />
      </View>
    );
  }

  // Flujo activo: verificacion de telefono - codigo OTP
  if (activeSection === "phone" && !phoneVerified && phoneVerif.step === "verify") {
    return (
      <View className="flex-1 bg-white p-5 pt-6">
        <Pressable onPress={phoneVerif.onGoBack} className="mb-8">
          <Text className="text-sky-600 text-base">Volver</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-sky-600 text-center mb-2">
          Ingresa el Codigo
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Enviamos un codigo de 6 digitos a tu telefono
        </Text>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Codigo de Verificacion</Text>
          <Controller
            control={phoneVerif.otpForm.control}
            rules={{
              required: "El codigo es requerido",
              minLength: { value: 6, message: "El codigo debe tener 6 digitos" },
              maxLength: { value: 6, message: "El codigo debe tener 6 digitos" },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && (
                  <Text className="text-red-500 mt-1 text-center">{error.message}</Text>
                )}
              </>
            )}
            name="code"
          />
        </View>

        <Text className="text-gray-500 text-center mb-4">
          El codigo expira en 10 minutos
        </Text>

        <ButtonDS
          onPress={phoneVerif.otpForm.handleSubmit(phoneVerif.onVerifyOtp)}
          text="Verificar"
        />

        <Pressable onPress={phoneVerif.onResendOtp} className="mt-6 items-center">
          <Text className="text-sky-600 underline">Reenviar codigo</Text>
        </Pressable>
      </View>
    );
  }

  // Flujo activo: verificacion de email - input
  if (activeSection === "email" && !emailVerified && emailVerif.step === "input") {
    return (
      <View className="flex-1 bg-white p-5 pt-6">
        <Pressable onPress={() => setActiveSection(null)} className="mb-8">
          <Text className="text-sky-600 text-base">Volver</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-sky-600 text-center mb-2">
          {user?.userInformation?.emailVerified ? "Cambiar Email" : "Verificacion de Email"}
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          {user?.userInformation?.emailVerified
            ? "Ingresa tu nuevo correo electronico"
            : "Ingresa tu correo electronico para verificarlo"}
        </Text>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Correo Electronico</Text>
          <Controller
            control={emailVerif.emailForm.control}
            rules={{
              required: "El correo es requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de correo invalido",
              },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 text-lg"
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && (
                  <Text className="text-red-500 mt-1">{error.message}</Text>
                )}
              </>
            )}
            name="email"
          />
        </View>

        <ButtonDS
          onPress={emailVerif.emailForm.handleSubmit(emailVerif.onSendOtp)}
          text="Enviar Codigo"
        />
      </View>
    );
  }

  // Flujo activo: verificacion de email - codigo OTP
  if (activeSection === "email" && !emailVerified && emailVerif.step === "verify") {
    return (
      <View className="flex-1 bg-white p-5 pt-6">
        <Pressable onPress={emailVerif.onGoBack} className="mb-8">
          <Text className="text-sky-600 text-base">Volver</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-sky-600 text-center mb-2">
          Ingresa el Codigo
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Enviamos un codigo de 6 digitos a tu correo electronico
        </Text>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Codigo de Verificacion</Text>
          <Controller
            control={emailVerif.otpForm.control}
            rules={{
              required: "El codigo es requerido",
              minLength: { value: 6, message: "El codigo debe tener 6 digitos" },
              maxLength: { value: 6, message: "El codigo debe tener 6 digitos" },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {error && (
                  <Text className="text-red-500 mt-1 text-center">{error.message}</Text>
                )}
              </>
            )}
            name="code"
          />
        </View>

        <Text className="text-gray-500 text-center mb-4">
          El codigo expira en 10 minutos
        </Text>

        <ButtonDS
          onPress={emailVerif.otpForm.handleSubmit(emailVerif.onVerifyOtp)}
          text="Verificar"
        />

        <Pressable onPress={emailVerif.onResendOtp} className="mt-6 items-center">
          <Text className="text-sky-600 underline">Reenviar codigo</Text>
        </Pressable>
      </View>
    );
  }

  // Vista principal del perfil
  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-sky-600 mb-5">Mi Perfil</Text>

      <View className="bg-gray-100 rounded-lg p-4 mb-4">
        <Text className="text-gray-600 mb-1">Nombre</Text>
        <Text className="text-lg font-semibold">
          {user?.userInformation?.firstName} {user?.userInformation?.lastName}
        </Text>
      </View>

      <View className="bg-gray-100 rounded-lg p-4 mb-4">
        <Text className="text-gray-600 mb-1">Rol</Text>
        <Text className="text-lg font-semibold capitalize">
          {user?.userInformation?.role}
        </Text>
      </View>

      {/* Seccion Email */}
      <View
        className={`rounded-lg p-4 mb-4 ${emailVerified ? "bg-green-100" : "bg-yellow-50 border border-yellow-300"}`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-600 mb-1">Email</Text>
            <Text className="text-lg font-semibold">
              {user?.userInformation?.email || "Sin correo"}
            </Text>
            {emailVerified ? (
              <Text className="text-green-700 text-sm mt-1">Verificado</Text>
            ) : (
              <Text className="text-yellow-700 text-sm mt-1">Sin verificar</Text>
            )}
          </View>
          <Pressable
            onPress={() => { emailVerif.onReset(); setActiveSection("email"); }}
            className="bg-sky-600 px-3 py-2 rounded-md"
          >
            <Text className="text-white font-semibold">
              {user?.userInformation?.emailVerified ? "Cambiar" : "Verificar"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Seccion Telefono */}
      <View
        className={`rounded-lg p-4 mb-4 ${phoneVerified ? "bg-green-100" : "bg-yellow-50 border border-yellow-300"}`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-600 mb-1">Telefono</Text>
            <Text className="text-lg font-semibold">
              {user?.userInformation?.phoneNumber || "Sin telefono"}
            </Text>
            {phoneVerified ? (
              <Text className="text-green-700 text-sm mt-1">Verificado</Text>
            ) : (
              <Text className="text-yellow-700 text-sm mt-1">Sin verificar</Text>
            )}
          </View>
          <Pressable
            onPress={() => { phoneVerif.onReset(); setActiveSection("phone"); }}
            className="bg-sky-600 px-3 py-2 rounded-md"
          >
            <Text className="text-white font-semibold">
              {user?.userInformation?.phoneVerified ? "Cambiar" : "Verificar"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
