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
import { View, Pressable, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Toast from "react-native-toast-message";

import BottomSheetBody from "./components/BottomSheetBody";
import { logCatchErr } from "../../../api/utils/crashlytics";
import CustomMarker from "../../../components/CustomMarker";
import LoadingSpinner from "../../../components/LoadingSpinner";
import MapButtonsRightTop from "../../../components/MapButtonsRightTop";
import useRound from "../../../hooks/useRound";
import { LocationType } from "../../../types";
import { LOCATION_TASK_NAME } from "../../../utils/constants";
import { updateRoundLocation } from "../../../api/firestore/roundsApi";

interface LocationCustom extends LocationType {
  position: number;
}

export default function MapLocations() {
  const id = useId();

  const router = useRouter();

  const { roundUuid } = useLocalSearchParams();

  const [currentLocationSelected, setCurrentLocationSelected] =
    useState<LocationCustom>();

  const mapRef = useRef<any>();

  const { roundData, contractorData, loading } = useRound({
    roundUuid: roundUuid as string,
  });

  const mapFitToCoordinates = () => {
    if (roundData && contractorData && mapRef.current) {
      mapRef.current.fitToCoordinates(
        roundData.locations.map((l) => ({ latitude: l.lat, longitude: l.lng })),
        {
          edgePadding: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
          },
        }
      );
    }
  };

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

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
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }
        const { status: backStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backStatus !== "granted") {
          return;
        }
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Location",
            notificationBody: "Location tracking in background",
            notificationColor: "#fff",
          },
        });
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        logCatchErr(err);
      }
    };
    getLocation();
    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
  }, []);

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
    if (error) {
      logCatchErr(error);
      return;
    }
    if (data) {
      setCurrentLocation(data.locations[0].coords);
    }
  });

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, []);

  const updateLocation = async () => {
    Toast.show({
      type: "success",
      text1: "Ubicación actualizada",
      text2: "Felicitaciones, Actualizaste el punto de la ronda",
    });
    await updateRoundLocation({
      roundUuid: roundUuid as string,
      locationUuid: currentLocationSelected?.uuid as string,
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    });
    goToCurrentLocation();
    bottomSheetModalRef.current?.close();
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["15%", "30%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  if (!roundData || !roundData.locations || !contractorData || loading)
    return <LoadingSpinner text="Cargando..." />;

  return (
    <>
      <Stack.Screen
        options={{
          title: roundData.name,
          headerLeft: () => (
            <>
              <Pressable
                onPress={() => router.navigate("/list-rounds")}
                className="ml-2"
              >
                <Ionicons name="arrow-back" color="white" size={26} />
              </Pressable>
            </>
          ),
        }}
      />
      <BottomSheetModalProvider>
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
            onMapReady={() => mapFitToCoordinates()}
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
            {roundData.locations?.map((location, index: number) => {
              return (
                <Marker
                  zIndex={888}
                  key={`${id}${index}`}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  onPress={() => {
                    setCurrentLocationSelected({
                      ...location,
                      position: index,
                    });
                    handlePresentModalPress();
                  }}
                >
                  <CustomMarker fontSize={14} index={index} isChecked={false} />
                </Marker>
              );
            })}
          </MapView>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <BottomSheetBody
                name={currentLocationSelected?.name ?? ""}
                position={currentLocationSelected?.position as number}
                nfcCode={contractorData.nfcCode}
                updateLocation={updateLocation}
              />
            </BottomSheetView>
          </BottomSheetModal>
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
