import * as Location from "expo-location";
import { useEffect, useState } from "react";

import { useLastPositionStore } from "../store/location";

const useCurrentPosition = () => {
  const setLastPosition = useLastPositionStore(
    (state) => state.setLastPosition,
  );
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLastPosition(location);
    })();
  }, []);
  return { errorMsg, location };
};

export default useCurrentPosition;
