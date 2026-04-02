import firestore from "@react-native-firebase/firestore";
import { format, subDays, parse, isAfter } from "date-fns";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/auth";
import { RoundGuard } from "../views/app/rounds/types";

const useRoundGuardsByDay = () => {
  const user = useUserStore((state) => state.user);
  const [roundsListData, setRoundsListData] = useState<RoundGuard[]>();
  const [roundsListDataLoading, setRoundsListDataLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) {
      setRoundsListDataLoading(false);
      return;
    }

    const roundsRef = firestore()
      .collection("roundsByDays")
      .doc("guard")
      .collection(user.uuid);

    const todayFormatted = format(new Date(), "yyyy-MM-dd");
    const yesterdayFormatted = format(subDays(new Date(), 1), "yyyy-MM-dd");

    let unsubscribe: () => void;

    const fetchData = () => {
      const now = new Date();

      unsubscribe = roundsRef
        .where("dayFormatted", "in", [todayFormatted, yesterdayFormatted])
        .onSnapshot(
          (querySnapshot) => {
            const rounds = querySnapshot.docs
              .map(
                (doc) =>
                  ({
                    ...doc.data(),
                    uuid: doc.id,
                  }) as RoundGuard
              )
              .filter(
                (round) =>
                  round.dayFormatted === todayFormatted ||
                  (round.dayFormatted === yesterdayFormatted &&
                    round.enableShiftNextDay === true)
              )
              .map((round) => ({
                ...round,
                roundsForTheDay: round.roundsForTheDay?.filter((r) => {
                  if (!round.shiftLimitEnd) return true;

                  if (
                    round.dayFormatted === todayFormatted &&
                    round.enableShiftNextDay === true
                  ) {
                    return true;
                  }

                  const shiftEndTime = parse(
                    round.shiftLimitEnd,
                    "HH:mm",
                    new Date()
                  );
                  return isAfter(shiftEndTime, now);
                }),
              }))
              .filter((round) => round.roundsForTheDay?.length > 0);

            setRoundsListData(rounds);
            setRoundsListDataLoading(false);
          },
          (error) => {
            console.error(error);
            setRoundsListDataLoading(false);
          }
        );
    };

    fetchData();

    const interval = setInterval(fetchData, 60 * 1000);

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uuid]);

  return {
    roundsListData,
    setRoundsListData,
    roundsListDataLoading,
  };
};

export default useRoundGuardsByDay;
