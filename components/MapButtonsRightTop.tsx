import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

const MapButtonsRightTop = ({
  buttonList,
}: {
  buttonList: {
    actionFunction: () => void;
    icon: string;
  }[];
}) => {
  return (
    <View className="top-5 right-5 absolute self-end">
      {buttonList.map((button) => (
        <Pressable
          key={button.icon}
          className="bg-indigo-600 p-3 mt-5 rounded"
          onPress={button.actionFunction}
        >
          <Ionicons name={button.icon} color="white" size={20} />
        </Pressable>
      ))}
    </View>
  );
};

export default MapButtonsRightTop;
