import "react-native-get-random-values";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  View,
  Text,
} from "react-native";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";

import ButtonDS from "../../../../components/ButtonDS";
import RutInput from "../../../../components/RutInput";
import { useUserStore } from "../../../../store/auth";
import { formatRut } from "../../../../utils/rutUtils";
import { createControlAccessInFirestore } from "../../../../api/firestore/controlAccessApi";

type Inputs = {
  name: string;
  rut: string;
  directedTo: string;
  authorizedBy: string;
  vehiclePlate: string;
};

const AccessManualPageView = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { uuid, run } = useLocalSearchParams();

  const createNewManualAccess = (data: Inputs) => {
    const uuid = uuidv4();
    createControlAccessInFirestore({
      ...data,
      contractorUuid: user?.userInformation.contractorUuid ?? "",
      guardUuid: user?.uuid ?? "",
      uuid,
    });
    Toast.show({
      type: "success",
      text1: "Ingresado con éxito",
      text2: "Se realizo el ingreso con éxito",
    });
    router.navigate({
      pathname: "/access",
    });
  };

  const { handleSubmit, control, reset } = useForm<Inputs>();

  useEffect(() => {
    reset({
      name: "",
      rut: formatRut(run as string) ?? "",
      directedTo: "",
    });
  }, [uuid, run]);

  return (
    <ScrollView className="mt-5">
      <KeyboardAvoidingView enabled>
        <View className="mx-2">
          <Text className="font-bold">Nombre: </Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4"
                onChangeText={(valueIn) => onChange(valueIn)}
                value={value}
              />
            )}
          />
          <Text className="font-bold">Rut: </Text>
          <Controller
            control={control}
            name="rut"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <RutInput
                onChange={onChange}
                initialValue={run as string}
                value={value}
                uuid={uuid as string}
              />
            )}
          />
          <Text className="font-bold">Se dirige a: </Text>
          <Controller
            control={control}
            name="directedTo"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4"
                onChangeText={(valueIn) => onChange(valueIn)}
                value={value}
              />
            )}
          />
          <Text className="font-bold">Autorizado por: </Text>
          <Controller
            control={control}
            name="authorizedBy"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4"
                onChangeText={(valueIn) => onChange(valueIn)}
                value={value}
              />
            )}
          />
          <Text className="font-bold">Placa Vehículo: </Text>
          <Controller
            control={control}
            name="vehiclePlate"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-md p-2 mb-4"
                onChangeText={(valueIn) => onChange(valueIn)}
                value={value}
              />
            )}
          />
          <ButtonDS
            className="mb-2"
            onPress={handleSubmit(createNewManualAccess)}
            text="Agregar Ingreso"
          />
          <ButtonDS
            className="mb-2 bg-emerald-700"
            onPress={() =>
              router.navigate({
                pathname: "/access",
              })
            }
            text="Cancelar"
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AccessManualPageView;
