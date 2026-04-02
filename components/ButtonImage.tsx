import React from "react";
import {
  ImageSourcePropType,
  Pressable,
  View,
  Image,
  Text,
} from "react-native";
import { twMerge } from "tailwind-merge";

const ButtonImage = ({
  text,
  onPress,
  imageSource,
  disabled,
}: {
  text: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View className="mx-5 align-center justify-center">
        <Image
          style={{ width: 80, height: 80 }}
          alt="entrance"
          source={imageSource}
        />
        <Text
          className={twMerge(
            "text-center font-bold text-lg my-2 mx-2",
            disabled ? "text-gray-500" : "text-black",
          )}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default ButtonImage;
