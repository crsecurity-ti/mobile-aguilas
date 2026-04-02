import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";

export const createControlAccessWorkerHistoryInFirestore = async ({
  uuid,
  contractorUuid,
  workerUuid,
  status,
  workerData,
}: any) => {
  const docRef = firestore()
    .collection("controlAccessWorkerHistory")
    .doc("contractor")
    .collection(contractorUuid ?? "a")
    .doc(uuid);
  const newData = {
    uuid,
    contractorUuid,
    workerUuid,
    workerData,
    day: format(new Date(), "yyyy-MM-dd"),
    status,
    createdAt: new Date().getTime(),
  };
  return await docRef.set(newData);
};
