import firestore from "@react-native-firebase/firestore";
import { AccessControlWorker } from "../../types";
import { format } from "date-fns";

export const deleteControlAccessWorkerInFirestore = async ({
  uuid,
  contractorUuid,
}: Partial<AccessControlWorker>) => {
  const docRef = firestore()
    .collection("controlAccessWorker")
    .doc("contractor")
    .collection(contractorUuid ?? "a")
    .doc(uuid);
  return await docRef.delete();
};

export const updateControlAccessWorkerInFirestore = async ({
  uuid,
  contractorUuid,
  workerUuid,
  status,
}: Partial<AccessControlWorker>) => {
  const docRef = firestore()
    .collection("controlAccessWorker")
    .doc("contractor")
    .collection(contractorUuid ?? "a")
    .doc(uuid);

  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data) {
      const newData = {
        ...data,
        uuid,
        status,
        workerUuid,
        updatedAt: new Date().getTime(),
      };
      await docRef.update(newData);
    }
  }
};

export const createControlAccessWorkerInFirestore = async ({
  uuid,
  contractorUuid,
  workerUuid,
  status,
}: Partial<AccessControlWorker>) => {
  const docRef = firestore()
    .collection("controlAccessWorker")
    .doc("contractor")
    .collection(contractorUuid ?? "a")
    .doc(uuid);
  const newData = {
    uuid,
    contractorUuid,
    workerUuid,
    day: format(new Date(), "yyyy-MM-dd"),
    status,
    createdAt: new Date().getTime(),
  };
  return await docRef.set(newData);
};
