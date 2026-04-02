import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";

export const createEventInFirestore = async ({
  eventUuid,
  contractorUuid,
  guardUuid,
  images,
  phoneImages,
  categoryUuid,
  description,
}: {
  eventUuid: string;
  contractorUuid: string;
  guardUuid: string;
  images: string[];
  phoneImages: string[];
  categoryUuid: string;
  description: string;
}) => {
  const docRef = firestore()
    .collection("event")
    .doc("contractor")
    .collection(contractorUuid);
  const newData = {
    uuid: eventUuid,
    contractorUuid,
    guardUuid,
    images,
    phoneImages,
    categoryUuid,
    description,
    day: format(new Date(), "yyyy-MM-dd"),
    createdAt: new Date().getTime(),
  };
  return await docRef.doc(eventUuid).set(newData);
};

export const createEventSupervisorInFirestore = async ({
  eventUuid,
  supervisorUuid,
  images,
  phoneImages,
  categoryUuid,
  contractorUuid,
  description,
}: {
  eventUuid: string;
  supervisorUuid: string;
  images: string[];
  phoneImages: string[];
  categoryUuid: string;
  contractorUuid: string;
  description: string;
}) => {
  const docRef = firestore()
    .collection("event")
    .doc("supervisor")
    .collection(supervisorUuid)
    .doc(eventUuid);
  const newData = {
    uuid: eventUuid,
    supervisorUuid,
    images,
    phoneImages,
    categoryUuid,
    contractorUuid,
    description,
    day: format(new Date(), "yyyy-MM-dd"),
    createdAt: new Date().getTime(),
  };
  return await docRef.set(newData);
};

export const updateEventSupervisorImagesInFirestore = async ({
  eventUuid,
  images,
  userUuid,
}: {
  eventUuid: string;
  images: string[];
  userUuid: string;
}) => {
  const docRef = firestore()
    .collection("event")
    .doc("supervisor")
    .collection(userUuid)
    .doc(eventUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data) {
      const newData = {
        ...data,
        images: [...data.images, ...images],
      };
      await docRef.update(newData);
    }
  }
};

export const updateEventImagesInFirestore = async ({
  eventUuid,
  images,
  contractorUuid,
}: {
  eventUuid: string;
  images: string[];
  contractorUuid: string;
}) => {
  const docRef = firestore()
    .collection("event")
    .doc("contractor")
    .collection(contractorUuid)
    .doc(eventUuid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data) {
      const newData = {
        ...data,
        images: [...data.images, ...images],
      };
      await docRef.update(newData);
    }
  }
};
