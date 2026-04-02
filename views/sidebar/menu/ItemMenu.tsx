import React from "react";
import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const ItemMenu = ({
  text,
  onPress,
  className = "",
}: {
  text: string;
  onPress: any;
  className?: string;
}) => {
  return (
    <View className="m-5">
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <>
            <Text
              className={twMerge(
                "font-semibold text-base",
                pressed ? "text-gray-600" : "text-black",
                className,
              )}
            >
              {text}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

export default ItemMenu;
