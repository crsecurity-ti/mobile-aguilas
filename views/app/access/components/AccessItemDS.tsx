import { differenceInMinutes, format } from "date-fns";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { AccessControl } from "../../../../types/access";

const AccessItemDS = ({
  onPress,
  accessControl,
  type = "normal",
}: {
  onPress: any;
  accessControl: AccessControl;
  type?: "normal" | "historial";
}) => {
  const timeInMinutes = differenceInMinutes(
    new Date(),
    accessControl.createdAt,
  );
  const hours = Math.floor(timeInMinutes / 60);
  const remainingMinutes = timeInMinutes % 60;

  return (
    <Pressable className="mx-2 mb-1" onPress={onPress}>
      <View className="bg-white border border-gray-200 rounded-lg p-2">
        <View className="flex flex-row justify-between">
          <View>
            <Text className="font-bold text-2xl">{accessControl.name}</Text>
            <Text className="text-blue-800 font-semibold">
              {accessControl.rut}
            </Text>
          </View>
          <View>
            <Text className="text-black font-bold text-lg">
              {accessControl.createdAt
                ? format(accessControl.createdAt, "dd-MM-yyyy")
                : ""}
            </Text>
            {type === "normal" ? (
              <Text>
                Hace:{" "}
                <Text className="text-blue-800 font-semibold">
                  {hours < 10 ? `0${hours}` : hours}:
                  {remainingMinutes < 10
                    ? `0${remainingMinutes}`
                    : remainingMinutes}{" "}
                  hrs
                </Text>
              </Text>
            ) : (
              <>
                <Text>
                  Entrada:{" "}
                  <Text className="text-blue-800 font-semibold">
                    {accessControl.createdAt
                      ? format(accessControl.createdAt, "HH:mm")
                      : ""}
                  </Text>
                </Text>
                <Text>
                  Salida:{" "}
                  <Text className="text-blue-800 font-semibold">
                    {accessControl.updatedAt
                      ? format(accessControl.updatedAt, "HH:mm")
                      : "Aun no tiene salida"}
                  </Text>
                </Text>
              </>
            )}
          </View>
        </View>
        <View>
          {accessControl.authorizedBy ? (
            <Text>
              Autorizado por:{" "}
              <Text className="font-bold">{accessControl.authorizedBy}</Text>
            </Text>
          ) : null}
          {accessControl.directedTo ? (
            <Text>
              Se dirigió a:{" "}
              <Text className="font-bold">{accessControl.directedTo}</Text>
            </Text>
          ) : null}
          {accessControl.vehiclePlate ? (
            <Text>
              Patente:{" "}
              <Text className="font-bold">{accessControl.vehiclePlate}</Text>
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export default AccessItemDS;
