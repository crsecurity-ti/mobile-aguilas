import "react-native-get-random-values";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

import LoadingSpinner from "../LoadingSpinner";

const BarCodeContainer = ({
  validateQRCode,
}: {
  validateQRCode: (data: string) => Promise<void>;
}) => {
  const { uniqueInstance } = useLocalSearchParams();
  const isFocused = useIsFocused();

  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice("back");

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      handleBarCodeScanned(codes[0].value as string);
    },
  });

  const handleBarCodeScanned = async (data: string) => {
    if (!loading && !onQrLoaded.current) {
      onQrLoaded.current = true;
      setLoading(true);
      await validateQRCode(data);
      setLoading(false);
    }
    if (onQrLoaded.current) {
      setTimeout(() => {
        onQrLoaded.current = false;
      }, 3000);
    }
  };

  const onQrLoaded = useRef(false);

  const [loading, setLoading] = useState(false);

  const resetQrLoaded = () => {
    onQrLoaded.current = false;
    setLoading(false);
  };

  useEffect(() => {
    resetQrLoaded();
  }, [uniqueInstance]);

  if (loading === true) return <LoadingSpinner text="Cargando..." />;

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
    <View style={styles.container}>
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          isActive
          codeScanner={codeScanner}
          device={device}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default BarCodeContainer;
