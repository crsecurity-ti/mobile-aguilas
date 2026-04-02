import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { RoundSupervisor } from "../views/app/rounds/supervisor/types";

const useRoundSupervisorList = () => {
  const user = useUserStore((state) => state.user);
  const [roundsListData, setRoundsListData] = useState<RoundSupervisor[]>([]);
  const [roundsListDataLoading, setRoundsListDataLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) {
      setRoundsListDataLoading(false);
      return;
    }

    const roundsRef = firestore()
      .collection("roundsSupervisor")
      .doc("supervisor")
      .collection(user.uuid);
    const q = roundsRef.where(
      "fullDay",
      "==",
      format(new Date(), "yyyy-MM-dd"),
    );

    const unsubscribe = q.onSnapshot(
      (querySnapshot) => {
        const rounds = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as RoundSupervisor[];
        setRoundsListData(rounds);
        setRoundsListDataLoading(false);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        setRoundsListDataLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uuid]);

  return {
    roundsListData,
    setRoundsListData,
    roundsListDataLoading,
  };
};

export default useRoundSupervisorList;
