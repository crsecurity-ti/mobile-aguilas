import firestore from "@react-native-firebase/firestore";
import { RoundSupervisor } from "../../views/app/rounds/supervisor/types";
import { getDistance } from "geolib";

const checkConsecutive = (data: RoundSupervisor, qrCode: string) => {
  if (data.locations.length <= 1) return true;

  const firstPosition = data.locations.findIndex(
    (location) => location.contractor.qrCode === qrCode,
  );

  const previousLocation = data.locations[firstPosition - 1];

  if (!previousLocation) return true;

  if (previousLocation.status !== "check") return false;

  return false;
}

export const updateRoundSupervisorStatusDb = async ({
  userUuid,
  roundUuid,
  qrCode,
  nfcCode,
  status,
  checkData,
  currentLocation,
}: {
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  userUuid: string;
  roundUuid: string;
  qrCode?: string;
  nfcCode?: string;
  status: string;
  checkData: {
    time: number;
  };
}) => {
  const docRef = firestore()
    .collection("roundsSupervisor")
    .doc("supervisor")
    .collection(userUuid)
    .doc(roundUuid);

  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as RoundSupervisor;

    let shouldUpdateOnlyTheFirstLocation = true;

    if (data.type === "consecutive" && qrCode) {
      const isValid = checkConsecutive(data, qrCode);

      if (!isValid) {
        return { error: true, msg: "INVALID_CONSECUTIVE" };
      }
    }

    if (qrCode) {
      const location = data.locations.find(
        (location) => location.contractor.qrCode === qrCode
      );
      if (location && location.contractor.lat && location.contractor.lng) {
        const dis = getDistance(
          {
            latitude: currentLocation?.latitude ?? 0,
            longitude: currentLocation?.longitude ?? 0,
          },
          {
            latitude: location.contractor.lat,
            longitude: location.contractor.lng,
          }
        );
        if (dis > 25) {
          return { error: true, msg: "DISTANCE_ERROR" };
        }
      }
    }

    const locations = data.locations.map((location) => {
      if (
        (location.contractor.qrCode === qrCode ||
          location.contractor.nfcCode === nfcCode) &&
        shouldUpdateOnlyTheFirstLocation == true &&
        location.status !== "check"
      ) {
        shouldUpdateOnlyTheFirstLocation = false;
        return { ...location, status, checkData };
      }
      return location;
    });

    const newData = {
      ...data,
      locations,
    };

    try {
      await docRef.update(newData);
      return { error: false };
    } catch (error) {
      return { error: true, msg: "UPDATE_FAILED" };
    }
  } else {
    return { error: true, msg: "DOC_NOT_FOUND" };
  }
};

export const updateRoundSupervisorTimeDb = async ({
  userUuid,
  roundUuid,
  startRound,
  endRound,
}: {
  userUuid: string;
  roundUuid: string;
  startRound?: { time: string };
  endRound?: { time: string };
}) => {
  const docRef = firestore()
    .collection("roundsSupervisor")
    .doc("supervisor")
    .collection(userUuid)
    .doc(roundUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as RoundSupervisor;
    const newData = startRound
      ? {
          ...data,
          startRound,
        }
      : {
          ...data,
          endRound,
        };
    await docRef.update(newData);
  }
};
