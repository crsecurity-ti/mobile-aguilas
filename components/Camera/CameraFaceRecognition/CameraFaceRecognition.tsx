import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  useWindowDimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  CameraPosition,
  Frame,
  PhotoFile,
  Camera as VisionCamera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useIsFocused } from "@react-navigation/core";
import { useAppState } from "@react-native-community/hooks";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Camera,
  Face,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";
import {
  CONTROL_BUTTON_SIZE,
  CONTENT_SPACING,
  SAFE_AREA_PADDING,
} from "../utils/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SuccessMatchCard from "./SuccessMatchCard";
import ErrorMatchCard from "./ErrorMatchCard";
import { addSeconds, isAfter } from "date-fns";
import { router } from "expo-router";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { validatePersonBiometric } from "../../../api/validatePersonBiometric";
import { useUserStore } from "../../../store/auth";

type MatchStatus = "success" | "error" | "clean";

function CameraFaceRecognition(): JSX.Element {
  return (
    <SafeAreaProvider>
      <FaceDetection />
    </SafeAreaProvider>
  );
}

function FaceDetection(): JSX.Element {
  const user = useUserStore((state) => state.user);

  const { width, height } = useWindowDimensions();
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const appState = useAppState();
  const cameraRef = useRef<VisionCamera>(null);
  const [currentMatchData, setCurrentMatchData] = useState<{
    name: string;
    rut: string;
    matchPercentage: number;
  }>({
    name: "",
    rut: "",
    matchPercentage: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const isCameraActive = !loading && isFocused && appState === "active";
  const [cameraMounted, setCameraMounted] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>("front");
  const [isProcessingFaceDetection, setIsProcessingFaceDetection] =
    useState(false);

  const cameraDevice = useCameraDevice(cameraFacing);

  const [currentMatchStatus, setCurrentMatchStatus] = useState<{
    matchStatus: MatchStatus;
    currentUpdateTime: Date;
  }>({
    matchStatus: "clean",
    currentUpdateTime: new Date(),
  });

  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        currentMatchStatus.matchStatus !== "clean" &&
        isAfter(new Date(), addSeconds(currentMatchStatus.currentUpdateTime, 5))
      ) {
        setCurrentMatchStatus({
          matchStatus: "clean",
          currentUpdateTime: new Date(),
        });
        setLoading(false);
        setCurrentMatchData({
          name: "",
          rut: "",
          matchPercentage: 0,
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentMatchStatus]);

  const faceDetectionOptions: FaceDetectionOptions = {
    performanceMode: "fast",
    classificationMode: "all",
    contourMode: "all",
    landmarkMode: "all",
    windowWidth: width,
    windowHeight: height,
    autoMode: true,
    minFaceSize: 0.7,
  };

  const handleCameraMountError = (error: any) => {
    console.error("Camera mount error:", error);
  };

  const onMediaCaptured = async (media: PhotoFile) => {
    try {
      setLoading(true);
      setCurrentText("Foto tomada, verificando...");
      const { path: imageUri } = media;
      if (!user?.userInformation?.businessUuid || !user?.userInformation?.contractorUuid) {
        throw new Error("No se pudo validar la persona, puede volver a intentarlo en 5 segundos");
      }
      const result: any = await validatePersonBiometric({
        imageUri,
        businessUuid: user?.userInformation?.businessUuid ?? "",
        contractorUuid: user?.userInformation?.contractorUuid ?? "",
      });

      if (result?.success == true) {
        setCurrentText("Persona verificada correctamente");
        setCurrentMatchStatus({
          matchStatus: "success",
          currentUpdateTime: new Date(),
        });
        setCurrentMatchData({
          name: result.name,
          rut: result.rut,
          matchPercentage: result.matchPercentage[0] * 100,
        });
      } else {
        setCurrentText(
          "No se pudo validar la persona, puede volver a intentarlo en 5 segundos"
        );
        setCurrentMatchStatus({
          matchStatus: "error",
          currentUpdateTime: new Date(),
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Error desconocido en la reconocimiento facial",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFacesDetected = async (faces: Face[], frame: Frame) => {
    if (isProcessingFaceDetection) return; 

    setIsProcessingFaceDetection(true);

    try {
      if (faces.length === 0 || !faces[0]) {
        setCurrentText("No hay rostros detectados");
        return;
      }

      const { bounds } = faces[0];
      const { width, height } = bounds;

      const faceAreaPercentage =
        ((width * height) / (frame.width * frame.height)) * 100;

      if (faceAreaPercentage > 3) {
        const photo = await cameraRef.current?.takePhoto({
          flash: "off",
          enableShutterSound: false,
        });

        if (!photo) {
          setCurrentText("No se pudo tomar la foto, re-intentando...");
          return;
        }

        await onMediaCaptured(photo);
      } else {
        setCurrentText("Favor acerque la cara más para confirmar");
      }
    } catch (error) {
      console.error("Face detection error:", error);
    } finally {
      setTimeout(() => {
        setIsProcessingFaceDetection(false);
      }, 2000); // Debounce for 2 seconds to prevent frequent triggers
    }
  };

  return (
    <>
      <View style={[StyleSheet.absoluteFill, styles.centeredView]}>
        {hasPermission && cameraDevice ? (
          <>
            {cameraMounted ? (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                isActive={isCameraActive}
                device={cameraDevice}
                photo={true}
                onError={handleCameraMountError}
                faceDetectionCallback={handleFacesDetected}
                faceDetectionOptions={faceDetectionOptions}
                pointerEvents="none"
              />
            ) : (
              <Text style={styles.warningText}>Camera is NOT mounted</Text>
            )}

            {loading && (
              <View className="flex justify-center w-full h-full bg-white/70">
                <View className="flex-col justify-center">
                  <ActivityIndicator color="#0ea5e9" size="large" />
                  <Text className="text-center pt-5 text-sky-500 text-xl font-semibold">
                    Verificando...
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.errorText}>No camera device or permission</Text>
        )}
      </View>

      <View style={styles.leftButtonRow}>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("volver");
            router.navigate("/home");
          }}
        >
          <MaterialCommunityIcons name="arrow-left" color="white" size={24} />
        </Pressable>
      </View>

      <View style={styles.rightButtonRow}>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("here");
            setCameraFacing((current) =>
              current === "front" ? "back" : "front"
            );
          }}
        >
          <MaterialCommunityIcons name="camera-flip" color="white" size={24} />
        </Pressable>
      </View>

      <View style={styles.centerTop}>
        {currentText && (
          <View className="bg-white rounded-md p-2">
            <Text className="text-xl font-bold text-center">{currentText}</Text>
          </View>
        )}
      </View>

      <View style={styles.centerBottom}>
        {currentMatchStatus.matchStatus === "success" && (
          <SuccessMatchCard currentMatchData={currentMatchData} />
        )}
        {currentMatchStatus.matchStatus === "error" && <ErrorMatchCard />}
      </View>

      {!cameraMounted && (
        <View style={styles.mountButtonContainer}>
          <Button
            onPress={() => setCameraMounted(!cameraMounted)}
            title="Mount Cam"
          />
        </View>
      )}
    </>
  );
}

export default CameraFaceRecognition;

const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    width: "100%",
    backgroundColor: "rgb(255,255,0)",
    textAlign: "center",
  },
  errorText: {
    width: "100%",
    backgroundColor: "rgb(255,0,0)",
    textAlign: "center",
    color: "white",
  },
  rightButtonRow: {
    position: "absolute",
    right: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  leftButtonRow: {
    position: "absolute",
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: "rgba(140, 140, 140, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerBottom: {
    position: "absolute",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    bottom: SAFE_AREA_PADDING.paddingBottom + 40,
  },
  centerTop: {
    position: "absolute",
    alignSelf: "center",
    top: SAFE_AREA_PADDING.paddingTop + 50,
  },
  mountButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
  },
});
