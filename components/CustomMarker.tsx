import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";

interface CustomMarkerProps {
  fontSize?: number;
  index?: number;
  isChecked?: boolean;
}

const successColor = "#3cb44b";
const stillToGoColor = "#e6194b";

const CustomMarker = memo(function Profile(props: CustomMarkerProps) {
  const { fontSize = 14, index = 0, isChecked = false } = props;
  const color = isChecked ? successColor : stillToGoColor;
  return (
    <View style={styles({ color }).container}>
      <View style={styles({ color }).bubble}>
        <Text style={[styles({ color }).amount, { fontSize }]}>
          {index + 1}
        </Text>
      </View>
      <View style={styles({ color }).arrowBorder} />
      <View style={styles({ color }).arrow} />
    </View>
  );
}, arePropsEqual);

function arePropsEqual(
  prevProps: CustomMarkerProps,
  nextProps: CustomMarkerProps,
) {
  return (
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.index === nextProps.index &&
    prevProps.isChecked === nextProps.isChecked
  );
}

const styles = (props: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      alignSelf: "flex-start",
    },
    bubble: {
      flex: 0,
      flexDirection: "row",
      alignSelf: "flex-start",
      backgroundColor: props.color,
      padding: 5,
      borderRadius: 4,
      borderColor: props.color,
      borderWidth: 3,
    },
    dollar: {
      color: "#FFFFFF",
      fontSize: 14,
    },
    amount: {
      width: 20,
      textAlign: "center",
      color: "#FFFFFF",
      fontSize: 13,
    },
    arrow: {
      backgroundColor: "transparent",
      borderWidth: 3,
      borderColor: "transparent",
      borderTopColor: props.color,
      alignSelf: "center",
      marginTop: -9,
    },
    arrowBorder: {
      backgroundColor: "transparent",
      borderWidth: 3,
      borderColor: "transparent",
      borderTopColor: props.color,
      alignSelf: "center",
      marginTop: -0.5,
    },
  });

export default CustomMarker;
