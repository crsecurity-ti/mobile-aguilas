import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { RoundByDay, typeRoundTime } from "../../types";
import { RoundGuard } from "../../views/app/rounds/types";

interface updateLocationStatusProps {
  roundListDataUuid: string;
  userUuid: string;
  roundDayUuid: string;
  locationUuid: string;
  status: string;
  checkData: any;
}

export const getGuardRoundByDay = async ({
  guardUuid,
}: {
  guardUuid: string;
}) => {
  const docRef = firestore()
    .collection("roundsByDays")
    .doc(guardUuid)
    .collection(format(new Date(), "yyyy-MM-dd"))
    .doc("roundByDay");
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    return docSnap.data() as RoundByDay;
  } else {
    return { roundsForTheDay: [] } as RoundByDay;
  }
};

export const updateRoundTimeDb = async ({
  roundListDataUuid,
  userUuid,
  roundDayUuid,
  startRound,
  endRound,
}: {
  roundListDataUuid: string;
  userUuid: string;
  roundDayUuid: string;
  startRound?: typeRoundTime;
  endRound?: typeRoundTime;
}) => {
  const docRef = firestore()
    .collection("roundsByDays")
    .doc("guard")
    .collection(userUuid)
    .doc(roundListDataUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as RoundGuard;
    const newData = {
      ...data,
      roundsForTheDay: data.roundsForTheDay.map((roundForTheDay) => {
        if (roundForTheDay.uuid === roundDayUuid) {
          if (startRound) {
            return {
              ...roundForTheDay,
              startRound,
            };
          }
          if (endRound) {
            return {
              ...roundForTheDay,
              endRound,
            };
          }
        }
        return roundForTheDay;
      }),
    };
    await docRef.update(newData);
  }
};

export const updateLocationStatus = async ({
  roundListDataUuid,
  userUuid,
  roundDayUuid,
  locationUuid,
  status,
  checkData,
}: updateLocationStatusProps) => {
  const docRef = firestore()
    .collection("roundsByDays")
    .doc("guard")
    .collection(userUuid)
    .doc(roundListDataUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as RoundGuard;
    const newData = {
      ...data,
      roundsForTheDay: data.roundsForTheDay.map((roundForTheDay) => {
        if (roundForTheDay.uuid === roundDayUuid) {
          return {
            ...roundForTheDay,
            locations: roundForTheDay.locations.map((location) => {
              if (
                location.qrCode === locationUuid ||
                location.nfcCode === locationUuid
              ) {
                return {
                  ...location,
                  status,
                  checkData,
                };
              }
              return location;
            }),
          };
        }
        return roundForTheDay;
      }),
    };
    await docRef.update(newData);
  }
};
