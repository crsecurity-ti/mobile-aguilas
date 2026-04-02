import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { Contractor } from "../types";

const useContractor = ({ contractorUuid }: { contractorUuid: string }) => {
  const [loading, setLoading] = useState(true);
  const [contractorData, setContractorData] = useState<Contractor>();

  useEffect(() => {
    const docRef = firestore().collection("contractors").doc(contractorUuid);

    const unsubscribe = docRef.onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
          setContractorData(docSnap.data() as Contractor);
        } else {
          // Handle the case where the document does not exist
          setContractorData(undefined);
        }
        setLoading(false);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        setLoading(false);
      },
    );

    // Cleanup function
    return () => unsubscribe();
  }, [contractorUuid]);

  return {
    contractorData,
    loading,
  };
};

export default useContractor;
