import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const createHourManagementInFirestore = async ({
  contractorUuid,
  businessUuid,
  userUuid,
  type = "personal",
}: {
  contractorUuid?: string;
  businessUuid?: string;
  userUuid: string;
  type?: "personal" | "supervisor";
}) => {
  const newUuid = uuidv4();
  if (type === "personal" && contractorUuid) {
    const docRef = firestore()
      .collection("hour_management")
      .doc("contractor")
      .collection(contractorUuid)
      .doc(newUuid);
    const newData = {
      uuid: newUuid,
      contractorUuid,
      userUuid,
      day: format(new Date(), "yyyy-MM-dd"),
      startHour: new Date().getTime(),
      endHour: null,
    };
    return await docRef.set(newData);
  }

  if (type === "supervisor" && businessUuid) {
    const docRef = firestore()
      .collection("hour_management")
      .doc("business")
      .collection(businessUuid)
      .doc(newUuid);
    const newData = {
      uuid: newUuid,
      businessUuid,
      userUuid,
      day: format(new Date(), "yyyy-MM-dd"),
      startHour: new Date().getTime(),
      endHour: null,
    };
    return await docRef.set(newData);
  }
};

export const updateHourManagementInFirestore = async ({
  contractorUuid,
  businessUuid,
  hourManagementUuid,
  endHour,
  type = "personal",
}: {
  contractorUuid?: string;
  businessUuid?: string;
  hourManagementUuid: string;
  endHour: number;
  type?: "personal" | "supervisor";
}) => {
  if (type === "personal" && contractorUuid) {
    const docRef = firestore()
      .collection("hour_management")
      .doc("contractor")
      .collection(contractorUuid)
      .doc(hourManagementUuid);
    return await docRef.update({ endHour });
  }

  if (type === "supervisor" && businessUuid) {
    const docRef = firestore()
      .collection("hour_management")
      .doc("business")
      .collection(businessUuid)
      .doc(hourManagementUuid);
    return await docRef.update({ endHour });
  }
};
