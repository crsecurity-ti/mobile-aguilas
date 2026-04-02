import { Dimensions } from "react-native";

export const PAGE_WIDTH = Dimensions.get("window").width;
export const PAGE_HEIGHT = Dimensions.get("window").height;

export const baseOptions = {
  vertical: false,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT * 0.2,
} as const;
