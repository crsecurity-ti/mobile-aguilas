import React from "react";
import { View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

import { RoundSupervisor } from "./types";

const ListLocationItem = ({
  item,
  index,
  roundSupervisor,
}: {
  item: any;
  index: number;
  roundSupervisor: RoundSupervisor;
}) => {
  const translate = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "check":
        return "Completado";
      case "in_progress":
        return "En progreso";
      default:
        return "Sin estado";
    }
  };
  return (
    <View
      className={twMerge(
        "px-5 py-2 rounded-md my-2 bg-white flex-1 flex-row justify-center",
        roundSupervisor.startRound?.time === "" ||
          (roundSupervisor.startRound?.time !== "" &&
            roundSupervisor.endRound?.time !== "")
          ? "opacity-50"
          : "opacity-100",
      )}
      style={{ flex: 1, flexDirection: "row" }}
    >
      <View className="mr-5 bg-gray-500 h-7 w-7 rounded-full z-1 justify-center">
        <Text
          className={twMerge(
            "text-center",
            item.status === "check" ? "text-green-500" : "text-white",
          )}
        >
          {index + 1}
        </Text>
      </View>

      <Text className="flex-1 mr-5 justify-center font-semibold">
        {item.contractor.name}
      </Text>
      {item.status ? (
        <Text className="flex-1 justify-end font-semibold">
          Status: {translate(item.status)}
        </Text>
      ) : null}
    </View>
  );
};

export default ListLocationItem;
