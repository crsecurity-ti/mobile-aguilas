import firestore from "@react-native-firebase/firestore";
import { Contractor } from "../../types";

export const updateContractorLocation = async ({
    contractorUuid,
    lat,
    lng,
  }: {
    contractorUuid: string;
    lat?: number;
    lng?: number;
  }) => {
    const docRef = firestore().collection("contractors").doc(contractorUuid);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data() as Contractor;
      const newData = {
        ...data,
        lat: lat ? lat : data.lat,
        lng: lng ? lng : data.lng,
      };
      await docRef.update(newData);
    }
  };
  