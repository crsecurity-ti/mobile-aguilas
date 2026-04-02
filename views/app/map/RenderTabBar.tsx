import React from "react";
import { View, Pressable, Animated } from "react-native";
import { twMerge } from "tailwind-merge";

interface RenderTabBarProps {
  navigationState: any;
  setIndex: (index: number) => void;
  index: number;
}

const RenderTabBar: React.FC<RenderTabBarProps> = ({ navigationState, setIndex, index }) => (
  <View className="flex-row">
    {navigationState.routes.map((route: any, i: number) => (
      <View
        className={twMerge(
          "flex-1 items-center p-3 border-b-2",
          index === i ? "border-b-cyan-500" : "border-b-gray-400"
        )}
        key={route.key}
      >
        <Pressable onPress={() => setIndex(i)}>
          <Animated.Text
            className={twMerge(
              "font-semibold",
              index === i ? "text-cyan-500" : "text-gray-400"
            )}
          >
            {route.title}
          </Animated.Text>
        </Pressable>
      </View>
    ))}
  </View>
);

export default RenderTabBar;
