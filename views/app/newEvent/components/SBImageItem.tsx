import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View, ActivityIndicator, Image, Text } from "react-native";

interface Props {
  style?: StyleProp<ViewStyle>;
  index?: number;
  image: string;
  showIndex?: boolean;
}

export const SBImageItem: React.FC<Props> = ({
  style,
  image,
  index: _index,
  showIndex = true,
}) => {
  const index = (_index || 0) + 1;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" />
      <Image
        key={index}
        style={styles.image}
        source={{
          uri: image,
        }}
      />
      <Text
        style={{
          position: "absolute",
          color: "white",
          fontSize: 40,
          backgroundColor: "#333333",
          borderRadius: 5,
          overflow: "hidden",
          paddingHorizontal: 10,
          paddingTop: 2,
        }}
      >
        {showIndex ? index : ""}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
