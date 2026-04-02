import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";

export type HourManagement = {
  uuid: string;
  businessUuid: string;
  userUuid: string;
  day: string;
  startHour: number;
  endHour: number | null;
};

const useHourManagementSupervisor = ({
  businessUuid,
  userUuid,
}: {
  businessUuid: string;
  userUuid: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [hourManagementData, setHourManagementData] =
    useState<HourManagement[]>();

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    const queryRef = firestore()
      .collection("hour_management")
      .doc("business")
      .collection(businessUuid)
      .where("userUuid", "==", userUuid)
      .where("endHour", "==", null)
      .where("day", "in", [today, yesterday]);

    const unsubscribe = queryRef.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs.map((doc) => doc.data());
          setHourManagementData(docData as HourManagement[]);
        } else {
          setHourManagementData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [businessUuid, userUuid]);

  return {
    hourManagementData,
    loading,
  };
};

export default useHourManagementSupervisor;
