import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { useUserStore } from "../store/auth";
import { AccessControl } from "../types/access";

const useAccessControl = () => {
  const user = useUserStore((state) => state.user);
  const [accessControlList, setAccessControlList] = useState<AccessControl[]>();
  const [accessControlListLoading, setAccessControlListLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) {
      setAccessControlListLoading(false);
      return;
    }

    const roundsRef = firestore()
      .collection("controlAccess")
      .doc("contractor")
      .collection(user?.userInformation.contractorUuid ?? "a")
      .where("status", "==", "in");

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

export default useAccessControl;
