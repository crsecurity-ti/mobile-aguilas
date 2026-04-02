import PermissionItemDS from "./PermissionItemDS";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

const NotificationPermissionContainer = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        setHasPermission(
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
        return;
      }
      if (parseInt(Platform.Version as string) <= 33) {
        setHasPermission(true);
        return;
      }
      const notificationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      setHasPermission(notificationPermission);
    };
    checkPermission();
  }, []);

  const requestPermission = async () => {
    try {
      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        setHasPermission(
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
        return;
      }
      const notificationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      setHasPermission(notificationPermission == "granted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PermissionItemDS
      title="Permiso Notificaciones"
      subtitle="Se requiere este permiso para poder mostrar las notificaciones correctamente y validar los documentos."
      buttonText="Activar permiso de notificaciones"
      permission={
        hasPermission
          ? { status: "granted", granted: true }
          : { status: "denied", granted: false }
      }
      requestPermission={requestPermission}
    />
  );
};

export default NotificationPermissionContainer;
