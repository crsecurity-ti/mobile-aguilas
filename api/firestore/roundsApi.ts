import firestore from "@react-native-firebase/firestore";
import { Round } from "../../types";

export const updateRoundLocation = async ({
  roundUuid,
  locationUuid,
  lat,
  lng,
}: {
  roundUuid: string;
  locationUuid: string;
  lat?: number;
  lng?: number;
}) => {
  const docRef = firestore().collection("rounds").doc(roundUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data() as Round;
    const newData = {
      ...data,
      locations: data.locations.map((location) => {
        if (location.uuid === locationUuid) {
          return {
            ...location,
            lat: lat ? lat : location.lat,
            lng: lng ? lng : location.lng,
          };
        }
        return location;
      }),
    };
    await docRef.update(newData);
  }
};
