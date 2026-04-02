import firestore from "@react-native-firebase/firestore";

export const updateSignatureFile = async ({
  businessUuid,
  signatureUuid,
  signature,
}: {
  businessUuid: string;
  signatureUuid: string;
  signature: string;
}) => {
  const docRef = firestore()
    .collection("signatures")
    .doc("business")
    .collection(businessUuid)
    .doc(signatureUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    await docRef.update({
      ...data,
      isSigned: true,
      signature: {
        image: signature,
        createdAt: new Date().getTime(),
      },
    });
  }
};
