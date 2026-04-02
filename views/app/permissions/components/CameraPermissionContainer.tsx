import { useCameraPermission } from "react-native-vision-camera";
import PermissionItemDS from "./PermissionItemDS";

const CameraPermissionContainer = () => {
  const { hasPermission, requestPermission } = useCameraPermission();

  return (
    <PermissionItemDS
      title="Permiso de la cámara"
      subtitle="Se requiere este permiso para poder visualizar con la cámara y validar los códigos QR."
      buttonText="Activar permiso de la cámara"
      permission={
        hasPermission
          ? { status: "granted", granted: true }
          : { status: "denied", granted: false }
      }
      requestPermission={requestPermission}
    />
  );
};

export default CameraPermissionContainer;
