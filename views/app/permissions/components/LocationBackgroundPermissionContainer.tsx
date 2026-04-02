import * as Location from "expo-location";

import PermissionItemDS from "./PermissionItemDS";

const LocationBackgroundPermissionContainer = () => {
  const [permission, requestPermission] = Location.useBackgroundPermissions();

  const handlePress = async () => {
    const response = await requestPermission();
    console.log("Permission response:", response);
  };


  return (
    <PermissionItemDS
      title="Ubicación Background"
      subtitle="Se requiere este permiso para poder dar seguimiento y validar los códigos QR."
      permission={permission}
      buttonText="Activar permiso de la ubicación"
      requestPermission={handlePress}
      canAskAgain={permission?.canAskAgain}
    />
  );
};

export default LocationBackgroundPermissionContainer;
