import React from "react";
import { StyleSheet, Text } from "react-native";

const LabelContractor = ({
  value,
  isFocus,
}: {
  value: string;
  isFocus: boolean;
}) => {
  if (!value || !isFocus) {
    return null;
  }
  return (
    <Text style={[styles.label, isFocus && { color: "blue" }]}>
      Dropdown label
    </Text>
  );
};

export default LabelContractor;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
