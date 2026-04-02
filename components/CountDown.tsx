import { addMinutes, format, intervalToDuration, Duration } from "date-fns";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import { checkIfRoundIsBlockedByTime } from "../utils/utils";

interface CountDownProps {
  previousRoundStartTime?: string;
  blockedTime?: number;
  onRoundIsNotBlocked?: () => void;
  shouldRender?: boolean;
}

const CountDown = ({
  previousRoundStartTime,
  blockedTime,
  onRoundIsNotBlocked,
  shouldRender = true,
}: CountDownProps) => {
  const [currentInterval, setCurrentInterval] = useState<Duration>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !checkIfRoundIsBlockedByTime(
          previousRoundStartTime ?? "",
          blockedTime ?? 0,
        )
      ) {
        onRoundIsNotBlocked && onRoundIsNotBlocked();
        clearInterval(interval);
        return;
      }
      setCurrentInterval(
        intervalToDuration({
          start: new Date(),
          end: new Date(
            addMinutes(
              new Date(previousRoundStartTime ?? ""),
              blockedTime ?? 0,
            ),
          ),
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (currentInterval === undefined) return null;

  if (!shouldRender) return null;

  return (
    <>
      <Text className="text-red-500">Ronda bloqueada</Text>
      <Text className="text-red-500 self-end">
        {format(
          new Date(previousRoundStartTime ?? ""),
          `${currentInterval.hours && currentInterval.hours < 10 ? "0" : ""}${currentInterval.hours || 0}:${
            currentInterval.minutes && currentInterval.minutes < 10 ? "0" : ""
          }${currentInterval.minutes || 0}:${
            currentInterval.seconds && currentInterval.seconds < 10 ? "0" : ""
          }${currentInterval.seconds || 0}`,
        )}
      </Text>
    </>
  );
};

export default CountDown;
