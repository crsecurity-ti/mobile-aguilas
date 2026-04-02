import * as Location from "expo-location";

import PermissionItemDS from "./PermissionItemDS";

const LocationPermissionContainer = () => {
  const [permission, requestPermission] = Location.useForegroundPermissions();

  return (
    <PermissionItemDS
      title="Permiso de la ubicación Foreground"
      subtitle="Se requiere este permiso para poder dar seguimiento y validar los códigos QR."
      permission={permission}
      buttonText="Activar permiso de la ubicación"
      requestPermission={requestPermission}
    />
  );
};

export default LocationPermissionContainer;
