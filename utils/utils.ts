import { addMinutes } from "date-fns";

import { RoundLocationsType, RoundsForTheDay } from "../types";
import { RoundGuard } from "../views/app/rounds/types";

export function getColorByIndex(index: number, colorList: string[]) {
  if (colorList.length === 0) {
    return null; // Return null if the list is empty
  }

  const colorIndex = index % colorList.length; // Wrap around the index using modulus operator

  return colorList[colorIndex];
}

interface GetTimeLeftProps {
  until: number;
}

export const getTimeLeft = ({ until }: GetTimeLeftProps) => {
  return {
    seconds: until % 60,
    minutes: (until / 60) % 60,
    hours: (until / (60 * 60)) % 24,
    days: until / (60 * 60 * 24),
  };
};

export const checkIfRoundIsBlockedByTime = (
  startTime: string,
  blockedTime: number,
) => {
  return (
    new Date(addMinutes(new Date(startTime), blockedTime)).getTime() >
    new Date().getTime()
  );
};

export const checkIfRoundIsBlockedByTimeDec = (
  startTime: string,
  blockedTime: number,
) => {
  return (
    new Date().getTime() >=
    new Date(addMinutes(new Date(startTime), blockedTime)).getTime()
  );
};

export const checkIfRoundIsActive = (
  round: RoundsForTheDay,
  index: number,
  roundListData: RoundGuard,
) => {
  if (round.startRound.time && round.endRound.time) {
    return { type: "roundFinished", active: false };
  }
  if (
    checkIfRoundIsBlockedByTimeDec(
      round.startRound.time ?? "",
      parseInt(round.blockedTime, 10),
    )
  ) {
    return { type: "roundActualIsBlocked", active: false };
  }
  if (roundListData?.roundsForTheDay[index - 1]?.startRound.time === "") {
    return { type: "roundBeforeNotStarted", active: false };
  }
  const blockedTime = roundListData?.roundsForTheDay[index - 1]?.blockedTime;
  if (blockedTime) {
    if (
      checkIfRoundIsBlockedByTime(
        roundListData?.roundsForTheDay[index - 1]?.startRound.time ?? "",
        parseInt(roundListData?.roundsForTheDay[index - 1].blockedTime, 10),
      )
    ) {
      return { type: "time", active: false };
    }
  }
  return { type: "none", active: true };
};

export const canContinueConsecutively = ({
  currentUuid,
  currentRoundData,
  qrLocation,
}: {
  currentUuid: string;
  currentRoundData: RoundGuard | undefined;
  qrLocation: RoundLocationsType;
}) => {
  const currentPosition = currentRoundData?.roundsForTheDay.filter(
    (r) => r.uuid === currentUuid,
  )[0];
  if (
    currentPosition?.type !== "consecutive" ||
    qrLocation.joinPosition === 0
  ) {
    return true;
  }

  const previousLocation = currentPosition.locations.filter(
    (l) => l.joinPosition === qrLocation.joinPosition - 1,
  )[0];

  if (!previousLocation) return false;

  if (previousLocation.status !== "check") return false;

  return true;
};

export const isValidUrl = (url: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  );

  return urlPattern.test(url);
};
