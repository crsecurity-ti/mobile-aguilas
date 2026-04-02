import firestore from "@react-native-firebase/firestore";

import { logCatchErr } from "../api/utils/crashlytics";

export const getUserDataDebug = async (userId: string) => {
  try {
    console.log('=== DEBUG getUserData ===');
    console.log('userId:', userId);
    console.log('Firebase project:', firestore().app.options);

    const userDocument = await firestore()
      .collection("users")
      .doc(userId)
      .get();

    console.log('userDocument.exists:', userDocument.exists);

    if (userDocument.exists) {
      const data = userDocument.data();
      console.log('userDocument.data():', JSON.stringify(data, null, 2));
      console.log('active field:', data?.active, 'type:', typeof data?.active);
      console.log('!data:', !data);
      console.log('!data.active:', !data?.active);
      console.log('data.active === "false":', data?.active === "false");
      return data;
    } else {
      console.log('Document does NOT exist');
      return null;
    }
  } catch (e) {
    console.error('Error in getUserData:', e);
    logCatchErr(e);
    return null;
  }
};
