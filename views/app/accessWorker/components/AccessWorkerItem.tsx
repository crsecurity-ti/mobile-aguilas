import { Text, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";

import { Worker } from "../../../../types";

const AccessWorkerItem = ({
  accessWorker,
  onPressControlItem,
  type,
}: {
  accessWorker: Worker;
  onPressControlItem: (accessWorker: Worker) => void;
  type: "inBuilding" | "outBuilding" | "inOutBuilding";
}) => {
  return (
    <Pressable onPress={() => onPressControlItem(accessWorker)}>
      <View className="mx-2 pb-1">
        <View
          className={twMerge(
            "rounded-lg overflow-hidden border-coolGray-200 border p-4",
            type === "inBuilding"
              ? "border-coolGray-300 bg-coolGray-200"
              : type === "inOutBuilding"
                ? "border-red-400 bg-red-200"
                : "border-gray-50 bg-gray-50",
          )}
        >
          <View className="flex-row justify-between items-center w-full">
            <View>
              <Text className="capitalize font-bold text-2xl">
                {accessWorker.name}
              </Text>
              <Text className="text-blue-800 font-semibold text-lg">
                {accessWorker.rut}
              </Text>
              {type !== "outBuilding" && (
                <Text className="text-base text-blue-800 font-semibold">
                  {type === "inBuilding"
                    ? "Dentro del recinto"
                    : "Fuera del recinto"}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AccessWorkerItem;
