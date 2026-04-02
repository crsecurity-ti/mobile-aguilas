import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { Contractor } from "../types";

const useContractors = () => {
  const user = useUserStore((state) => state.user);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [contractorsListDataLoading, setContractorsListDataLoading] =
    useState<boolean>(true);

  useEffect(() => {
    setContractorsListDataLoading(true);
    const q = firestore()
      .collection("contractors")
      .where("businessUuid", "==", user?.userInformation?.businessUuid ?? "");
    const unsubscribe = q.onSnapshot(
      (querySnapshot) => {
        const newContractors = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as Contractor[];
        setContractors(newContractors);
        setContractorsListDataLoading(false);
      },
      (error) => {
        console.error("Error fetching contractors:", error);
        setContractorsListDataLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    contractors,
    contractorsListDataLoading,
  };
};

export default useContractors;
