import { useEffect, useMemo, useState } from "react";
import { LOCATION_TASK_NAME } from "../../../../utils/constants";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { logCatchErr } from "../../../../api/utils/crashlytics";
import { useUserStore } from "../../../../store/auth";
import { useLastRoundStore } from "../../../../store/lastRound";
import { updateLocationInRound } from "../../../../api/firestore/roundsByDaysGpsApi";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
  if (error) {
    console.log(error);
    logCatchErr(error);
    return;
  }
  if (data) {
    const user = useUserStore.getState().user;
    const lastRound = useLastRoundStore.getState().lastRound;

    if (!lastRound) return;

    const { roundListDataUuid, uuid, roundUuid } = lastRound;
    updateLocationInRound({
      currentRoundUuid: uuid as string,
      roundUuid: roundUuid as string,
      userUuid: user?.uuid ?? "",
      roundListDataUuid: roundListDataUuid as string,
      newLocation: data.locations[0],
    });
  }
});

const useLocationTracking = () => {
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription>();

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const getLocation = async () => {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // 1 second
          distanceInterval: 1, // 1 meter
        },
        (location) => {
          setCurrentLocation(location.coords);
        }
      );
      setLocationSubscription(subscription);
    };
    getLocation();
  }, []);

  const getPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const { status: backStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backStatus !== "granted") {
      return;
    }
  };

  const startTracking = async () => {
    try {
      await getPermissions();

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 4, // 4 meter
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Location",
          notificationBody: "Location tracking in background",
          notificationColor: "#fff",
        },
      });
    } catch (error) {
      console.log("Error al iniciar el tracking", error);
    }
  };

  const stopTracking = async () => {
    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);

      await unregisterTask();
    } catch (error) {
      console.log("Error al detener el tracking", error);
    }
  };

  const unregisterTask = async () => {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);

    if (isRegistered) {
      await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    }
  };

  const removeLocationSubscription = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(undefined);
    }
  };

  return useMemo(
    () => ({
      unregisterTask,
      locationSubscription,
      setLocationSubscription,
      startTracking,
      stopTracking,
      removeLocationSubscription,
      currentLocation,
    }),
    [
      unregisterTask,
      locationSubscription,
      startTracking,
      stopTracking,
      currentLocation,
    ]
  );
};

export default useLocationTracking;
