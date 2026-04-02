import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  useWindowDimensions,
} from "react-native";
import {
  CameraPosition,
  DrawableFrame,
  Frame,
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
  Contours,
  Landmarks,
} from "react-native-vision-camera-face-detector";
import { ClipOp, Skia, TileMode } from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

function CameraTestFaceRecognition(): JSX.Element {
  return (
    <SafeAreaProvider>
      <FaceDetection />
    </SafeAreaProvider>
  );
}

function FaceDetection(): JSX.Element {
  const { width, height } = useWindowDimensions();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraMounted, setCameraMounted] = useState<boolean>(false);
  const [cameraPaused, setCameraPaused] = useState<boolean>(false);
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>("front");
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: "fast",
    classificationMode: "all",
    contourMode: "all",
    landmarkMode: "all",
    windowWidth: width,
    windowHeight: height,
  }).current;
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isCameraActive = !cameraPaused && isFocused && appState === "active";
  const cameraDevice = useCameraDevice(cameraFacing);
  //
  // vision camera ref
  //
  const camera = useRef<VisionCamera>(null);
  //
  // face rectangle position
  //
  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);
  const aRot = useSharedValue(0);
  const boundingBoxStyle = useAnimatedStyle(() => ({
    position: "absolute",
    borderWidth: 4,
    borderLeftColor: "rgb(0,255,0)",
    borderRightColor: "rgb(0,255,0)",
    borderBottomColor: "rgb(0,255,0)",
    borderTopColor: "rgb(255,0,0)",
    width: withTiming(aFaceW.value, {
      duration: 100,
    }),
    height: withTiming(aFaceH.value, {
      duration: 100,
    }),
    left: withTiming(aFaceX.value, {
      duration: 100,
    }),
    top: withTiming(aFaceY.value, {
      duration: 100,
    }),
    transform: [
      {
        rotate: `${aRot.value}deg`,
      },
    ],
  }));

  useEffect(() => {
    if (hasPermission) return;
    requestPermission();
  }, []);

  function handleUiRotation(rotation: number) {
    aRot.value = rotation;
  }

  function handleCameraMountError(error: any) {
    console.error("camera mount error", error);
  }

  function handleFacesDetected(faces: Face[], frame: Frame): void {
    // if no faces are detected we do nothing
    if (Object.keys(faces).length <= 0) {
      aFaceW.value = 0;
      aFaceH.value = 0;
      aFaceX.value = 0;
      aFaceY.value = 0;
      return;
    }

    // For testing purposes, we can log the faces and frame
    // console.log("faces", faces.length, "frame", frame.toString());

    if (!faces[0]) return;

    const { bounds } = faces[0];
    const { width, height, x, y } = bounds;
    aFaceW.value = width;
    aFaceH.value = height;
    aFaceX.value = x;
    aFaceY.value = y - 60;

    // only call camera methods if ref is defined
    if (camera.current) {
      // Camera frame size (assuming `frame` provides camera dimensions)
      const frameWidth = frame.width; // Get camera frame width
      const frameHeight = frame.height; // Get camera frame height

      // Calculate the face size as a percentage of the full camera view
      const faceWidthPercentage = (width / frameWidth) * 100;
      const faceHeightPercentage = (height / frameHeight) * 100;
      const faceAreaPercentage =
        ((width * height) / (frameWidth * frameHeight)) * 100;

      // console.log("Face vs Camera:");
      // console.log(`Width: ${faceWidthPercentage.toFixed(2)}%`);
      // console.log(`Height: ${faceHeightPercentage.toFixed(2)}%`);
      // console.log(`Total Area: ${faceAreaPercentage.toFixed(2)}%`);

      // console.log({ faceAreaPercentage });
      if (faceAreaPercentage > 8) {
        // take photo, capture video, etc...
        console.log("we can take the picture");
      } else {
        console.log("we can't take the picture, favor acercarse");
      }
    }
  }

  // function handleSkiaActions(faces: Face[], frame: DrawableFrame): void {
  //   "worklet";
  //   if (Object.keys(faces).length <= 0) return;

  //   console.log("SKIA - faces", faces.length, "frame", frame.toString());

  //   const { bounds, contours, landmarks } = faces[0];

  //   const blurRadius = 25;
  //   const blurFilter = Skia.ImageFilter.MakeBlur(
  //     blurRadius,
  //     blurRadius,
  //     TileMode.Repeat,
  //     null
  //   );
  //   const blurPaint = Skia.Paint();
  //   blurPaint.setImageFilter(blurFilter);
  //   const contourPath = Skia.Path.Make();
  //   const necessaryContours: (keyof Contours)[] = [
  //     "FACE",
  //     "LEFT_CHEEK",
  //     "RIGHT_CHEEK",
  //   ];

  //   necessaryContours.map((key) => {
  //     contours?.[key]?.map((point, index) => {
  //       if (index === 0) {
  //         contourPath.moveTo(point.x, point.y);
  //       } else {
  //         contourPath.lineTo(point.x, point.y);
  //       }
  //     });
  //     contourPath.close();
  //   });

  //   frame.save();
  //   frame.clipPath(contourPath, ClipOp.Intersect, true);
  //   frame.render(blurPaint);
  //   frame.restore();

  //   const mouthPath = Skia.Path.Make();
  //   const mouthPaint = Skia.Paint();
  //   mouthPaint.setColor(Skia.Color("red"));
  //   const necessaryLandmarks: (keyof Landmarks)[] = [
  //     "MOUTH_BOTTOM",
  //     "MOUTH_LEFT",
  //     "MOUTH_RIGHT",
  //   ];

  //   necessaryLandmarks.map((key, index) => {
  //     const point = landmarks?.[key];
  //     if (!point) return;

  //     if (index === 0) {
  //       mouthPath.moveTo(point.x, point.y);
  //     } else {
  //       mouthPath.lineTo(point.x, point.y);
  //     }
  //   });
  //   mouthPath.close();
  //   frame.drawPath(mouthPath, mouthPaint);

  //   const rectPaint = Skia.Paint();
  //   rectPaint.setColor(Skia.Color("blue"));
  //   rectPaint.setStyle(1);
  //   rectPaint.setStrokeWidth(5);
  //   frame.drawRect(bounds, rectPaint);
  // }

  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {hasPermission && cameraDevice ? (
          <>
            {cameraMounted && (
              <>
                <Camera
                  // @ts-ignore
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  isActive={isCameraActive}
                  device={cameraDevice}
                  onError={handleCameraMountError}
                  faceDetectionCallback={handleFacesDetected}
                  onUIRotationChanged={handleUiRotation}
                  // enable skia actions to draw a blur shape around the face points
                  // skiaActions={handleSkiaActions}
                  faceDetectionOptions={{
                    ...faceDetectionOptions,
                    autoMode,
                    minFaceSize: 0.7,
                    landmarkMode: "all",
                    classificationMode: "all",
                    contourMode: "all",
                    performanceMode: "accurate",
                  }}
                />

                <Animated.View style={boundingBoxStyle} />

                {cameraPaused && (
                  <Text
                    style={{
                      width: "100%",
                      backgroundColor: "rgb(0,0,255)",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Camera is PAUSED
                  </Text>
                )}
              </>
            )}

            {!cameraMounted && (
              <Text
                style={{
                  width: "100%",
                  backgroundColor: "rgb(255,255,0)",
                  textAlign: "center",
                }}
              >
                Camera is NOT mounted
              </Text>
            )}
          </>
        ) : (
          <Text
            style={{
              width: "100%",
              backgroundColor: "rgb(255,0,0)",
              textAlign: "center",
              color: "white",
            }}
          >
            No camera device or permission
          </Text>
        )}
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            onPress={() =>
              setCameraFacing((current) =>
                current === "front" ? "back" : "front"
              )
            }
            title={"Toggle Cam"}
          />

          <Button
            onPress={() => setAutoMode((current) => !current)}
            title={`${autoMode ? "Disable" : "Enable"} AutoMode`}
          />
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            onPress={() => setCameraPaused((current) => !current)}
            title={`${cameraPaused ? "Resume" : "Pause"} Cam`}
          />

          <Button
            onPress={() => setCameraMounted((current) => !current)}
            title={`${cameraMounted ? "Unmount" : "Mount"} Cam`}
          />
        </View>
      </View>
    </>
  );
}

export default CameraTestFaceRecognition;
