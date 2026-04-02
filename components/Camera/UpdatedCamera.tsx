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
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import LoadingSpinner from "../LoadingSpinner";
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;
const UpdatedCamera = ({
  from,
  extraParams,
}: {
  from: string;
  extraParams: any;
}) => {
  const camera = useRef<Camera>(null);

  const router = useRouter();
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const [loading, setLoading] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false); // Add a lock state

  const device = useCameraDevice("back");

  const { hasPermission, requestPermission } = useCameraPermission();

  const onMediaCaptured = async (media: PhotoFile) => {
    setLoading(false);
    setIsTakingPhoto(false);
    router.navigate({
      pathname: from,
      params: {
        photo: media.path.startsWith("file://")
          ? media.path
          : `file://${media.path}`,
        ...extraParams,
      },
    });
  };

  const takePhoto = async () => {
    if (isTakingPhoto) return;

    setIsTakingPhoto(true);
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      setLoading(true);
      const photo = await camera.current.takePhoto({
        flash: "off",
        enableShutterSound: false,
      });
      await onMediaCaptured(photo);
    } catch (e) {
      setLoading(false);
      setIsTakingPhoto(false);
      console.error("Failed to take photo!", e);
    }
  };

  if (!hasPermission)
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Necesitamos tu permiso para poder utilizar la cámara
        </Text>
        <Button onPress={requestPermission} title="Otorgar permiso" />
      </View>
    );

  if (device == null) return <Text>This device has not camera</Text>;

  return (
    <View className="flex flex-1 bg-black">
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          photo={true}
          isActive={isActive}
          ref={camera}
          photoQualityBalance="speed"
        />
      )}
      {loading && <LoadingSpinner text="Cargando..." />}
      <Pressable
        onPressIn={takePhoto}
        style={{
          ...styles.captureButton,
          opacity: !isActive || loading || isTakingPhoto ? 0.1 : 1,
        }}
        disabled={!isActive || loading || isTakingPhoto}
      >
        <View style={styles.shadow} />
        <View style={styles.button} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  },
  shadow: {
    position: "absolute",
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: "gray",
  },
});

export default UpdatedCamera;
