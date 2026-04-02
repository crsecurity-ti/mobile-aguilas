import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { AccessControlWorker } from "../types";

const useAccessWorkerList = () => {
  const user = useUserStore((state) => state.user);
  const [accessControlWorkerListData, setControlAccessWorkerListData] =
    useState<AccessControlWorker[]>([]);
  const [
    accessControlWorkerListDataLoading,
    setControlAccessWorkerListDataLoading,
  ] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) {
      setControlAccessWorkerListDataLoading(false);
      return;
    }

    const roundsRef = firestore()
      .collection("controlAccessWorker")
      .doc("contractor")
      .collection(user?.userInformation?.contractorUuid ?? "a");

    const unsubscribe = roundsRef.onSnapshot(
      (querySnapshot) => {
        const rounds = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as AccessControlWorker[];
        setControlAccessWorkerListData(rounds);
        setControlAccessWorkerListDataLoading(false);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        setControlAccessWorkerListDataLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uuid]);

  return {
    accessControlWorkerListData,
    setControlAccessWorkerListData,
    accessControlWorkerListDataLoading,
  };
};

export default useAccessWorkerList;
