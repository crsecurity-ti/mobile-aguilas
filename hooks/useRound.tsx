import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { logCatchErr } from "../api/utils/crashlytics";
import { Contractor, Round } from "../types";

const useRound = ({ roundUuid }: { roundUuid: string }) => {
  const [loading, setLoading] = useState(true);
  const [loadingContractor, setLoadingContractor] = useState(true);
  const [roundData, setRoundData] = useState<Round>();
  const [contractorData, setContractorData] = useState<Contractor>();

  useEffect(() => {
    const docRef = firestore().collection("rounds").doc(roundUuid);
    const unsubscribe = docRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        setRoundData(docSnap.data() as Round);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roundUuid]);

  useEffect(() => {
    async function getRoundInfo() {
      if (!roundData) return;

      try {
        const contractorDocRef = firestore()
          .collection("contractors")
          .doc(roundData.contractorUuid);
        const contractorDocSnap = await contractorDocRef.get();
        if (contractorDocSnap.exists) {
          setContractorData(contractorDocSnap.data() as Contractor);
        }
      } catch (e) {
        logCatchErr(e);
      } finally {
        setLoadingContractor(false);
      }
    }
    getRoundInfo();
  }, [roundData]);

  return {
    roundData,
    contractorData,
    loading: loading || loadingContractor,
  };
};

export default useRound;
