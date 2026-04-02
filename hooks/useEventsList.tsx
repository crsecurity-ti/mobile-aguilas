import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { Event } from "../types";

const useEventsList = () => {
  const user = useUserStore((state) => state.user);
  const [eventsListData, setEventsListData] = useState<Event[]>();

  useEffect(() => {
    if (!user?.userInformation.contractorUuid || !user?.userInformation.uuid) {
      return;
    }

    const eventsRef = firestore()
      .collection("event")
      .doc("contractor")
      .collection(user.userInformation.contractorUuid ?? "a");
    const q = eventsRef
      .where("guardUuid", "==", user.userInformation.uuid)
      .where("day", "==", format(new Date(), "yyyy-MM-dd"));

    const unsubscribe = q.onSnapshot(
      (querySnapshot) => {
        const events = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as Event[];
        setEventsListData(events);
      },
      (error) => {
        console.error(error);
      },
    );

    return () => unsubscribe();
  }, [user?.userInformation.contractorUuid, user?.userInformation.uuid]);

  return {
    eventsListData,
    setEventsListData,
  };
};

export default useEventsList;
