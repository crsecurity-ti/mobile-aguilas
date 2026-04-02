import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useIsForeground } from "./hooks/useIsForeground";
import { CAPTURE_BUTTON_SIZE, SAFE_AREA_PADDING } from "./utils/constants";
import { useRef, useState, useEffect, useCallback } from "react";
import { loginWithFacial } from "../../api/loginWithFacial";
import useSignIn from "../../views/auth/signIn/hooks/useSignIn";
import LoadingSpinner from "../LoadingSpinner";
import Toast from "react-native-toast-message";

const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

const CameraSignIn = () => {
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [loading, setLoading] = useState(false);

  const { loading: loadingSignIn, onLoginWithCustomToken } = useSignIn();

  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;
  const device = useCameraDevice("front");

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const onMediaCaptured = useCallback(
    async (media: PhotoFile) => {
      try {
        setLoading(true);
        const { path: imageUri } = media;
        const result: any = await loginWithFacial({ imageUri });

        if (result?.customToken) {
          Toast.show({
            type: "success",
            text1: "Inicio de sesión exitoso",
          });
          onLoginWithCustomToken(result.customToken);
        } else {
          throw new Error("Cara no registrada, o la fotografía no es clara");
        }
      } catch (error: any) {
        console.error("Facial login failed:", error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Error desconocido en el inicio de sesión",
        });
      } finally {
        setLoading(false);
      }
    },
    [onLoginWithCustomToken]
  );

  const takePhoto = useCallback(async () => {
    if (!camera.current) {
      console.error("Camera ref is null!");
      return;
    }

    try {
      setLoading(true);
      const photo = await camera.current.takePhoto({
        flash: "off",
        enableShutterSound: false,
      });
      await onMediaCaptured(photo);
    } catch (error) {
      console.error("Failed to take photo:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo capturar la imagen",
      });
    } finally {
      setLoading(false);
    }
  }, [onMediaCaptured]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Necesitamos tu permiso para utilizar la cámara
        </Text>
        <Button onPress={requestPermission} title="Otorgar permiso" />
      </View>
    );
  }

  if (!device) {
    return <Text>No se encontró una cámara compatible</Text>;
  }

  return (
    <View style={styles.cameraContainer}>
      {(loading || loadingSignIn) && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner
            text={
              loadingSignIn
                ? "Revisando el inicio de sesión..."
                : "Verificando la imagen..."
            }
          />
        </View>
      )}

      {isActive && (
        <Camera
          style={styles.camera}
          device={device}
          photo={true}
          isActive={isActive}
          ref={camera}
          photoQualityBalance="speed"
          resizeMode="cover"
        />
      )}

      <Pressable
        onPress={takePhoto}
        style={styles.captureButton}
        disabled={!isActive || loading || loadingSignIn}
      >
        <View style={styles.shadow} />
        <View style={styles.button} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  captureButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  shadow: {
    position: "absolute",
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: "gray",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default CameraSignIn;
