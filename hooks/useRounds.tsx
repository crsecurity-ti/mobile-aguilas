import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { Round } from "../types";

const useRounds = ({ contractorUuid }: { contractorUuid: string }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [contractorsListDataLoading, setRoundsListDataLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!contractorUuid) {
      setRoundsListDataLoading(false);
      return;
    }

    const roundsRef = firestore().collection("rounds");
    const q = roundsRef.where("contractorUuid", "==", contractorUuid);

    const unsubscribe = q.onSnapshot(
      (querySnapshot) => {
        const newRounds = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as Round[];
        setRounds(newRounds);
        setRoundsListDataLoading(false);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        setRoundsListDataLoading(false);
      },
    );

    return () => unsubscribe();
  }, [contractorUuid]);

  return {
    rounds,
    contractorsListDataLoading,
  };
};

export default useRounds;
