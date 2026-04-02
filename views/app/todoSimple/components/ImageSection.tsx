import React, { useEffect, useState } from "react";
import CarouselPhotos from "../../../../components/CarouselPhotos/CarouselPhotos";
import ButtonDS from "../../../../components/ButtonDS";
import { View } from "react-native";
import { router } from "expo-router";

const ImageSection = ({
  images,
  photo,
  append,
  task,
}: {
  images: string[];
  photo: string;
  append: (image: string) => void;
  task: string;
}) => {

  useEffect(() => {
    if (photo && photo !== "" && photo !== undefined) {
      append(photo);
    }
  }, [photo]);

  const addNewPhoto = () => {
    router.navigate({
      pathname: "/simple-camera",
      params: { from: "todo-simple", task: task },
    });
  };

  return (
    <View className="my-2">
      <CarouselPhotos images={images.map((image) => ({ image: image.replace("images/", "images%2F") }))} />
      <ButtonDS
        onPress={addNewPhoto}
        text="Subir una nueva foto"
        className="bg-gray-500"
      />
    </View>
  );
};

export default ImageSection;
