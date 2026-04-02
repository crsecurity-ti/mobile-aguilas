import firestore from "@react-native-firebase/firestore";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { AccessControl } from "../types/access";

const useAccessControlHistorial = () => {
  const user = useUserStore((state) => state.user);
  const [accessControlList, setAccessControlList] = useState<AccessControl[]>();
  const [accessControlListLoading, setAccessControlListLoading] =
    useState<boolean>(true);

  const startDate = `${format(subDays(new Date() as Date, 1), "yyyy-MM-dd")}T00:00:00.000Z`;
  const endDate = `${format(new Date() as Date, "yyyy-MM-dd")}T23:59:59.000Z`;

  useEffect(() => {
    if (!user?.uuid) {
      setAccessControlListLoading(false);
      return;
    }

    const roundsRef = firestore()
      .collection("controlAccess")
      .doc("contractor")
      .collection(user?.userInformation.contractorUuid ?? "a")
      .where("day", ">=", startDate)
      .where("day", "<=", endDate);

    const unsubscribe = roundsRef.onSnapshot(
      (querySnapshot) => {
        const rounds = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uuid: doc.id,
        })) as AccessControl[];
        setAccessControlList(rounds);
        setAccessControlListLoading(false);
      },
      (error) => {
        // Handle any errors
        console.error(error);
        setAccessControlListLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uuid]);

  return {
    accessControlList,
    setAccessControlList,
    accessControlListLoading,
  };
};

export default useAccessControlHistorial;
