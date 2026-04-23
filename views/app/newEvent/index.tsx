import "react-native-get-random-values";

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

import CarouselPhotos from "../../../components/CarouselPhotos/CarouselPhotos";
import SelectContractor from "./SelectContractor/SelectContractor";
import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useUserStore } from "../../../store/auth";
import { startQueue } from "../../../utils/TaskQueueDB/utils/queueUtils";
import Toast from "react-native-toast-message";
import {
  createEventInFirestore,
  createEventSupervisorInFirestore,
} from "../../../api/firestore/eventApi";
import { createImageUploadToDb } from "../../../database/services/imagesUpload.service";
import SelectCategory from "./SelectCategory/SelectCategory";

type Inputs = {
  images: string[];
  categoryUuid: string;
  contractorUuid: string;
  description: string;
};

const EventView = () => {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const { photo, uuid } = useLocalSearchParams();
  const router = useRouter();

  const { handleSubmit, control, watch, reset } = useForm<Inputs>();

  const { append } = useFieldArray({
    control,
    name: "images" as never,
  });

  useEffect(() => {
    reset({
      images: [],
      categoryUuid: "",
      contractorUuid: "",
      description: "",
    });
  }, [uuid]);

  useEffect(() => {
    if (photo) {
      append(photo);
    }
  }, [photo]);

  const createNewEvent = async (data: any) => {
    if (!data.categoryUuid || !data.contractorUuid || !data.description) {
      if (!data.categoryUuid) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Debe seleccionar una categoría",
        });
      }
      if (!data.contractorUuid) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Debe seleccionar una instalación",
        });
      }
      if (!data.description) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Debe ingresar una descripción",
        });
      }
      return;
    }
    setLoading(true);
    const images = data.images;
    let typeEvent = "";
    const eventUuid = uuidv4();
    if (user?.userInformation.role === "supervisor") {
      createEventSupervisorInFirestore({
        eventUuid,
        images: [],
        phoneImages: images,
        categoryUuid: data.categoryUuid,
        contractorUuid: data.contractorUuid,
        description: data.description,
        supervisorUuid: user?.uuid ?? "",
      });
      typeEvent = "supervisor";
    } else {
      createEventInFirestore({
        eventUuid,
        contractorUuid: user?.userInformation.contractorUuid ?? "",
        phoneImages: images,
        images: [],
        categoryUuid: data.categoryUuid,
        description: data.description,
        guardUuid: user?.uuid ?? "",
      });
      typeEvent = "personal";
    }

    for (let index = 0; index < images.length; index++) {
      await createImageUploadToDb({
        id: uuidv4(),
        eventUuid,
        currentImage: images[index],
        typeEvent,
        name: uuidv4(),
        createdAt: new Date(),
        contractorUuid:
          user?.userInformation.role === "supervisor"
            ? data.contractorUuid
            : user?.userInformation.contractorUuid,
        userUuid: user?.uuid ?? "",
      });
    }

    startQueue();
    setLoading(false);

    router.navigate(
      user?.userInformation.role === "supervisor"
        ? "events-supervisor"
        : "events"
    );
  };

  const addNewPhoto = () => {
    router.navigate("/simple-camera");
  };

  if (loading) {
    return <LoadingSpinner text="Cargando..." />;
  }

  const images = watch("images");

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="mx-2">
            <CarouselPhotos
              images={images?.map((image) => ({
                image: image.replace("images/", "images%2F"),
              }))}
            />
            <ButtonDS
              onPress={addNewPhoto}
              text="Subir una nueva foto"
              className="bg-gray-500"
            />
            <Text className="font-bold my-2">Instalación: </Text>
            <Controller
              control={control}
              name="contractorUuid"
              render={({ field: { onChange, value } }) => (
                <SelectContractor
                  onChange={(value: string) => onChange(value)}
                  value={value}
                />
              )}
            />
            <Text className="font-bold my-2">Categoría: </Text>
            <Controller
              control={control}
              name="categoryUuid"
              render={({ field: { onChange, value } }) => (
                <SelectCategory
                  onChange={(value: string) => onChange(value)}
                  value={value}
                />
              )}
            />
            <Text className="font-bold my-2">Descripción: </Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border-2 border-gray-300 rounded-lg w-full"
                  editable
                  placeholder="Ingrese una descripción del evento"
                  multiline
                  numberOfLines={4}
                  onChangeText={(text) => onChange(text)}
                  value={value}
                  style={{ padding: 10 }}
                />
              )}
              name="description"
              rules={{ required: true }}
            />
            <ButtonDS
              onPress={handleSubmit(createNewEvent)}
              className="my-5 bg-green-600"
              text="Agregar Evento"
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default EventView;
