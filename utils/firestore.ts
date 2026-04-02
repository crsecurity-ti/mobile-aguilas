import firestore from "@react-native-firebase/firestore";

import { logCatchErr } from "../api/utils/crashlytics";

export const getUserData = async (userId: string) => {
  try {
    const userDocument = await firestore()
      .collection("users")
      .doc(userId)
      .get();
    if (userDocument.exists) {
      return userDocument.data();
    } else {
      return null;
    }
  } catch (e) {
    logCatchErr(e);
    return null;
  }
};

export const getEventsFromContractor = (
  contractorUuid: string,
  callback: any,
) => {
  return firestore()
    .collection("events")
    .doc(contractorUuid)
    .onSnapshot(
      (documentSnapshot) => {
        if (documentSnapshot.exists) {
          callback(documentSnapshot.data());
        } else {
          callback([]);
        }
      },
      (error) => {
        // Handle any errors
        console.error(error);
      },
    );
};
