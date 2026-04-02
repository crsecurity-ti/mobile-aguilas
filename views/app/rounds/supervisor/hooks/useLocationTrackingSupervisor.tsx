import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "../../../../../utils/constants";
import { useUserStore } from "../../../../../store/auth";
import { logCatchErr } from "../../../../../api/utils/crashlytics";
import { updateLocationSupervisorInRound } from "../../../../../api/firestore/roundsByDaysGpsSupervisorApi";
import * as TaskManager from "expo-task-manager";
import { useLastSupervisorRoundStore } from "../../../../../store/lastSupervisorRound";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
  if (error) {
    console.log(error);
    logCatchErr(error);
    return;
  }
  if (data) {
    const user = useUserStore.getState().user;
    const lastSupervisorRound =
      useLastSupervisorRoundStore.getState().LastSupervisorRound;
    if (!lastSupervisorRound) return;
    const { uuid } = lastSupervisorRound;
    updateLocationSupervisorInRound({
      roundUuid: uuid,
      supervisorUuid: user?.uuid ?? "",
      newLocation: data.locations[0],
    });
  }
});

const useLocationTrackingSupervisor = () => {
  const startTracking = async () => {
    console.log("start Tracking");
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 30000, // 5 minutes second
      distanceInterval: 4, // 4 meter
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
    });
  };

  const stopTracking = async () => {
    const isTaskRunning =
      await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isTaskRunning) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  };

  return {
    startTracking,
    stopTracking,
  };
};

export default useLocationTrackingSupervisor;
