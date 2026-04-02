import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";

import RoundPercentage from "./RoundPercentage";
import { RoundGuard } from "./types";
import CountDown from "../../../components/CountDown";
import CountUp from "../../../components/CountUp";
import { RoundsForTheDay } from "../../../types";
import { checkIfRoundIsActive } from "../../../utils/utils";

interface RoundListRenderItemProps {
  item: RoundsForTheDay | any;
  index: number;
  roundListData: RoundGuard;
}

const RoundListRenderItem = ({
  item,
  index,
  roundListData,
}: RoundListRenderItemProps) => {
  const router = useRouter();

  const [isRoundActive, setIsRoundActive] = useState(
    checkIfRoundIsActive(item, index, roundListData),
  );

  useEffect(() => {
    setIsRoundActive(checkIfRoundIsActive(item, index, roundListData));
  }, [roundListData]);

  return (
    <View className="py-5 border-b border-gray-400">
      <Pressable
        disabled={!isRoundActive.active}
        className={!isRoundActive.active ? "opacity-50" : "opacity-100"}
        onPress={() => {
          router.navigate({
            pathname: "/map",
            params: {
              roundListDataUuid: roundListData.uuid,
              uuid: item.uuid,
              roundUuid: roundListData?.roundUuid,
            },
          });
        }}
      >
        <View className="justify-between flex-row">
          <View>
            <Text className="font-bold text-gray-800">{item.name}</Text>
            <Text className="font-semibold text-gray-600">
              Ronda Numero {index + 1} {item.description}
            </Text>
          </View>
          <View>
            {!isRoundActive.active && isRoundActive.type === "time" ? (
              <CountDown
                previousRoundStartTime={
                  roundListData?.roundsForTheDay[index - 1]?.startRound.time ??
                  ""
                }
                blockedTime={parseInt(
                  roundListData?.roundsForTheDay[index]?.blockedTime,
                  10,
                )}
                onRoundIsNotBlocked={() =>
                  setIsRoundActive(
                    checkIfRoundIsActive(item, index, roundListData),
                  )
                }
              />
            ) : null}
            {item.startRound.time ? (
              <Text className="text-sm text-gray-800 self-start">
                {item.startRound.time &&
                  format(new Date(item.startRound.time), "yyyy-MM-dd HH:mm")}
              </Text>
            ) : null}
            {item.endRound.time ? (
              <Text className="text-sm text-gray-800 self-start">
                {item.endRound.time &&
                  format(new Date(item.endRound.time), "yyyy-MM-dd HH:mm")}
              </Text>
            ) : null}
            {item.startRound.time ? (
              <Text className="self-end">
                <RoundPercentage round={item} />
              </Text>
            ) : null}
            {isRoundActive.active && item.startRound.time ? (
              <CountUp
                actualRoundStartTime={item.startRound.time}
                blockedTime={parseInt(item.blockedTime, 10)}
                onRoundIsBlocked={() =>
                  setIsRoundActive({
                    type: "roundActualIsBlocked",
                    active: false,
                  })
                }
                shouldRender={false}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default RoundListRenderItem;
