import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { router, Stack, useLocalSearchParams } from "expo-router";
import ImageSection from "./components/ImageSection";
import ButtonDS from "../../../components/ButtonDS";
import { Inputs } from "./types";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { updateTaskDayListInFirestore } from "../../../api/firestore/taskListApi";
import { useUserStore } from "../../../store/auth";
import { createImageUploadToDb } from "../../../database/services/imagesUpload.service";
import { v4 as uuidv4 } from "uuid";
import { startQueue } from "../../../utils/TaskQueueDB/utils/queueUtils";
import { useEffect } from "react";

const TodoSimple = () => {
  const user = useUserStore((state) => state.user);

  const { task, photo, uniqueUuid } = useLocalSearchParams();
  const taskData = JSON.parse(task as string);

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset, getValues, watch } = useForm<Inputs>({
    defaultValues: {
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    const taskDataIn = JSON.parse(task as string);

    reset({
      description: taskDataIn.userDescription || "",
      images: taskDataIn.images || [],
    });
  }, [task, reset]);

  const { append } = useFieldArray({
    control,
    name: "images" as never,
  });

  const updateTask = async (data: any) => {
    setIsLoading(true);

    const values = getValues();

    await updateTaskDayListInFirestore({
      userUuid: user?.uuid as string,
      mainTaskUuid: taskData.mainTaskUuid,
      userDescription: values.description,
      taskUuid: taskData.uuid,
      status: "completed",
      updatedTime: new Date(),
      images: [],
    });

    const images = values.images;

    for (let index = 0; index < images.length; index++) {
      if (
        !images[index].includes("images%2F") &&
        !images[index].includes("https://")
      ) {
        await createImageUploadToDb({
          id: uuidv4(),
          eventUuid: taskData.uuid,
          currentImage: images[index],
          typeEvent: "task",
          name: uuidv4(),
          createdAt: new Date(),
          contractorUuid: taskData.mainTaskUuid,
          userUuid: user?.uuid ?? "",
        });
      }
    }

    startQueue();

    setIsLoading(false);
    router.navigate({
      pathname: "/todo-list",
    });
  };

  const images = watch("images");

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.navigate({
                  pathname: "/todo-list",
                });
              }}
              className="ml-2"
            >
              <Ionicons name="arrow-back" color="white" size={26} />
            </Pressable>
          ),
        }}
      />
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-lg text-gray-500 mt-4">Cargando...</Text>
        </View>
      ) : (
        <ScrollView>
          <KeyboardAvoidingView enabled>
            <View className="mx-2">
              <Text className="text-2xl font-bold capitalize text-center my-2">
                {taskData.name}
              </Text>
              <Text className="text-sm text-gray-500 capitalize text-center">
                {taskData.description}
              </Text>
              <ImageSection
                images={images}
                photo={photo as string}
                append={append}
                task={task as string}
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="border-2 border-gray-300 rounded-lg w-full"
                    editable
                    placeholder="Ingrese un detalle de la tarea si gusta"
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
                onPress={handleSubmit(updateTask)}
                className="my-5 bg-green-600"
                disabled={isLoading}
                text={isLoading ? "Cargando..." : "Dar tarea por terminada"}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </>
  );
};

export default TodoSimple;
