import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Pressable, Button, StyleSheet, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Toast from "react-native-toast-message";

import BottomSheetBody from "./components/BottomSheetBody";
import CustomMarker from "../../../components/CustomMarker";
import LoadingSpinner from "../../../components/LoadingSpinner";
import MapButtonsRightTop from "../../../components/MapButtonsRightTop";
import useContractor from "../../../hooks/useContractor";
import { LOCATION_TASK_NAME } from "../../../utils/constants";
import { updateContractorLocation } from "../../../api/firestore/contractorsApi";

export default function MapAdminGeneral() {
  const id = useId();

  const router = useRouter();

  const { contractorUuid } = useLocalSearchParams();

  const mapRef = useRef<any>();

  const { contractorData, loading } = useContractor({
    contractorUuid: contractorUuid as string,
  });

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapReady) {
      mapFitToCoordinates();
    }
  }, [mapReady, contractorData?.uuid]);

  const mapFitToCoordinates = () => {
    if (contractorData && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: contractorData.lat,
        longitude: contractorData.lng,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  const goToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const { status: backStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backStatus !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 5,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Ubicación",
          notificationBody: "Estamos realizando seguimiento en segundo plano",
          notificationColor: "#fff",
        },
      });

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getLocation();

    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
  }, []);

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
    if (error) {
      return;
    }
    if (data) {
      setCurrentLocation(data.locations[0].coords);
    }
  });

  const requestPermissions = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 80,
      });
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, []);


  useEffect(() => {
    requestPermissions();
  }, []);

  const updateLocation = async () => {
    if (!currentLocation) {
      Toast.show({
        type: "error",
        text1: "Error de ubicación",
        text2:
          "La ubicación actual no puede ser utilizada correctamente, intente nuevamente en unos minutos",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Ubicación actualizada",
      text2: "Felicitaciones, Actualizaste el punto de la ronda",
    });
    await updateContractorLocation({
      contractorUuid: contractorUuid as string,
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    });
    goToCurrentLocation();
    bottomSheetModalRef.current?.close();
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  if (!contractorData || loading) return <LoadingSpinner text="Cargando..." />;

  return (
    <>
      <Stack.Screen
        options={{
          title: contractorData.name,
          headerLeft: () => (
            <>
              <Pressable
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                  router.navigate("/list-contractors-general");
                }}
                className="ml-2"
              >
                <Ionicons name="arrow-back" color="white" size={26} />
              </Pressable>
            </>
          ),
        }}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <BottomSheetBody
              contractorName={contractorData.name}
              contractorNfcCode={contractorData.nfcCode}
              updateLocation={updateLocation}
            />
          </BottomSheetView>
        </BottomSheetModal>
        <View className="flex-1">
          <MapView
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude: contractorData.lat,
              longitude: contractorData.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onMapReady={() => setMapReady(true)}
          >
            {currentLocation && (
              <Circle
                radius={2}
                zIndex={999}
                fillColor="blue"
                strokeColor="#000"
                center={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
              />
            )}
            <Marker
              zIndex={888}
              key={`${id}${contractorData.uuid}`}
              coordinate={{
                latitude: contractorData.lat,
                longitude: contractorData.lng,
              }}
              onPress={handlePresentModalPress}
            >
              <CustomMarker fontSize={14} index={0} isChecked={false} />
            </Marker>
          </MapView>
          <MapButtonsRightTop
            buttonList={[
              {
                actionFunction: () => goToCurrentLocation(),
                icon: "locate",
              },
              {
                actionFunction: () => mapFitToCoordinates(),
                icon: "map",
              },
            ]}
          />
        </View>
      </BottomSheetModalProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
