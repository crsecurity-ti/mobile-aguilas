import React from "react";
import { View } from "react-native";

import ButtonDS from "./ButtonDS";

const SimpleCardDS = ({
  onPressButton,
  textButton,
  body,
  disabled = false,
}: {
  onPressButton: any;
  textButton: string;
  body: any;
  disabled?: boolean;
}) => {
  return (
    <View className="mx-2 mb-1">
      <View className="bg-white border border-gray-200 rounded-lg p-2">
        {body}
        <ButtonDS
          text={textButton}
          className="p-3 font-bold"
          onPress={onPressButton}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default SimpleCardDS;
