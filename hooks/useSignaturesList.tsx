import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
// import { Event } from "../types";

const useSignaturesList = () => {
  const user = useUserStore((state) => state.user);
  const [signaturesListData, setEventsListData] = useState<any[]>();

  useEffect(() => {
    if (!user?.userInformation.uuid || !user?.userInformation.businessUuid) {
      return;
    }

    const eventsRef = firestore()
      .collection("signatures")
      .doc("business")
      .collection(user.userInformation.businessUuid ?? "a");

    const q = eventsRef
      .where("userUuid", "==", user.userInformation.uuid)
      .where("isSigned", "==", false);

    const unsubscribe = q.onSnapshot(
      (querySnapshot) => {
        const events = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as any[];
        setEventsListData(events);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, [user?.userInformation.uuid]);

  return {
    signaturesListData,
    setEventsListData,
  };
};

export default useSignaturesList;
