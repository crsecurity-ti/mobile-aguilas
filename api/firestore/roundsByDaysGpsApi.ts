import firestore from "@react-native-firebase/firestore";
import { LocationObject } from "expo-location";
import { Round } from "../../types";

export const updateLocationInRound = async ({
    currentRoundUuid,
    roundUuid,
    userUuid,
    roundListDataUuid,
    newLocation,
  }: {
    currentRoundUuid: string;
    roundUuid: string;
    userUuid: string;
    roundListDataUuid: string;
    newLocation: LocationObject;
  }) => {
    if (!userUuid || !roundListDataUuid || !roundUuid || !currentRoundUuid) {
      console.log("error updating location in round");
      return;
    }
  
    const docRef = firestore()
      .collection("roundsByDaysGps")
      .doc("guard")
      .collection(userUuid)
      .doc(roundListDataUuid)
      .collection(roundUuid)
      .doc(currentRoundUuid);
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
  