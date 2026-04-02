import firestore from "@react-native-firebase/firestore";
import { LocationObject } from "expo-location";
import { Round } from "../../types";

export const updateLocationSupervisorInRound = async ({
  roundUuid,
  supervisorUuid,
  newLocation,
}: {
  roundUuid: string;
  supervisorUuid: string;
  newLocation: LocationObject;
}) => {
  const docRef = firestore()
    .collection("roundsByDaysGpsSupervisor")
    .doc("supervisor")
    .collection(supervisorUuid)
    .doc(roundUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as Round;
    const newData = {
      ...data,
      locations: [...data.locations, newLocation],
    };
    await docRef.update(newData);
  } else {
    const newData = {
      locations: [newLocation],
    };
    return await docRef.set(newData);
  }
};
