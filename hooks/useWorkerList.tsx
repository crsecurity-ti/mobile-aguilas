import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { Worker } from "../types";

const useWorkerList = () => {
  const user = useUserStore((state) => state.user);
  const [workerListData, setWorkerListData] = useState<Worker[]>([]);
  const [workerListDataLoading, setWorkerListDataLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) {
      setWorkerListDataLoading(false);
      return;
    }

    const roundsRef = firestore()
      .collection("workers")
      .doc("contractor")
      .collection(user?.userInformation?.contractorUuid ?? "");

    const unsubscribe = roundsRef.onSnapshot(
      (querySnapshot) => {
        const rounds = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as Worker[];
        setWorkerListData(rounds);
        setWorkerListDataLoading(false);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        setWorkerListDataLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uuid]);

  return {
    workerListData,
    setWorkerListData,
    workerListDataLoading,
  };
};

export default useWorkerList;
