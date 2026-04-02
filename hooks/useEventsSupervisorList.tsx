import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { Event } from "../types";

const useEventsSupervisorList = () => {
  const user = useUserStore((state) => state.user);
  const [eventsListData, setEventsListData] = useState<Event[]>();

  useEffect(() => {
    if (!user?.userInformation.uuid) {
      // Handle the case where uuid is not available
      return;
    }

    const eventsRef = firestore()
      .collection("event")
      .doc("supervisor")
      .collection(user.userInformation.uuid);
    const q = eventsRef.where("day", "==", format(new Date(), "yyyy-MM-dd"));

    const unsubscribe = q.onSnapshot(
      (querySnapshot) => {
        const events = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as Event[];
        setEventsListData(events);
      },
      (error) => {
        // Handle any errors
        console.error(error);
      },
    );

    return () => unsubscribe();
  }, [user?.userInformation.uuid]);

  return {
    eventsListData,
    setEventsListData,
  };
};

export default useEventsSupervisorList;
