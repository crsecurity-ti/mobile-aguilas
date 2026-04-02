import React from "react";
import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "./variants";
import {  MaterialCommunityIcons } from "@expo/vector-icons";

const ButtonDSWithIcon = ({
  onPress,
  text,
  className = "",
  disabled = false,
  intent,
}: {
  onPress: any;
  text: string;
  className?: string;
  disabled?: boolean;
  intent?: "primary" | "outline";
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <View
          className={twMerge(
            "flex flex-row items-center justify-center",
            buttonVariants({ pressed, disabled, intent }),
            className
          )}
        >
          <MaterialCommunityIcons name="face-recognition" color="white" size={26} />
          <Text className="ml-2 text-white">{text}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default ButtonDSWithIcon;
