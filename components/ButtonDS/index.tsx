import React from "react";
import { Pressable, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "./variants";

const ButtonDS = ({
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
  intent?:
    | 'primary'
    | 'outline'
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <Text
          className={twMerge(buttonVariants({ pressed, disabled, intent }), className)}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default ButtonDS;
