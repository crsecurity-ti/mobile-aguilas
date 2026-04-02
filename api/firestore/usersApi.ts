import firestore from "@react-native-firebase/firestore";

export const updateUserToken = async ({
  userUuid,
  token,
}: {
  userUuid: string;
  token: string;
}) => {
  const docRef = firestore().collection("users").doc(userUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data) {
      await docRef.update({
        ...data,
        token,
      });
    }
  }
};
