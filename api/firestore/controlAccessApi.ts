import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";

export const updateControlAccessInFirestore = async ({
  uuid,
  contractorUuid,
  status = "out",
}: {
  uuid: string;
  contractorUuid: string;
  status?: "in" | "out";
}) => {
  const docRef = firestore()
    .collection("controlAccess")
    .doc("contractor")
    .collection(contractorUuid)
    .doc(uuid);

  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data) {
      const newData = {
        ...data,
        uuid,
        status,
        updatedAt: new Date().getTime(),
      };
      await docRef.update(newData);
    }
  }
};

export const createControlAccessInFirestore = async ({
  uuid,
  guardUuid,
  contractorUuid,
  name,
  rut,
  directedTo,
  authorizedBy,
  vehiclePlate,
}: {
  uuid: string;
  guardUuid: string;
  contractorUuid: string;
  name: string;
  rut: string;
  directedTo: string;
  authorizedBy: string;
  vehiclePlate: string;
}) => {
  const docRef = firestore()
    .collection("controlAccess")
    .doc("contractor")
    .collection(contractorUuid)
    .doc(uuid);
  const newData = {
    uuid,
    guardUuid,
    name,
    rut,
    directedTo,
    authorizedBy,
    vehiclePlate,
    day: format(new Date(), "yyyy-MM-dd"),
    status: "in",
    createdAt: new Date().getTime(),
  };
  return await docRef.set(newData);
};
