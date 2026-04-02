import "react-native-get-random-values";

import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useId, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

import RoundButton from "../components/RoundButton";
import { logCatchErr } from "../../../../api/utils/crashlytics";
import CustomMarker from "../../../../components/CustomMarker";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import MapButtonsRightTop from "../../../../components/MapButtonsRightTop";
import useRoundGuardsByDay from "../../../../hooks/useRoundGuardsByDay";
import { Contractor, Round } from "../../../../types";
import { Status } from "../../rounds/types";
import { useLastRoundStore } from "../../../../store/lastRound";
import useQrValidation from "../hooks/useQrValidation";
import useMap from "../hooks/useMap";
import MainHeader from "../MainHeader";
import ErrorComponent from "../../../../components/ErrorComponent";
import useLocationTracking from "../hooks/useLocationTracking";

export default function MapLocations() {
  const id = useId();
  const { uuid, roundUuid, roundListDataUuid } = useLocalSearchParams();

  const setLastRound = useLastRoundStore((state) => state.setLastRound);
  const [roundData, setRoundData] = useState<Round>();
  const [contractorData, setContractorData] = useState<Contractor>();

  const { roundsListData, roundsListDataLoading } = useRoundGuardsByDay();

  const { currentLocation } = useLocationTracking();

  const { isLoadingQrCode } = useQrValidation({
    roundData,
    currentLocation,
    roundsListData: roundsListData || [],
  });

  const { mapFitToCoordinates, setMapReady, mapRef, goToCurrentLocation } =
    useMap({ roundData, contractorData, currentLocation });

  useEffect(() => {
    if (!uuid || !roundUuid || !roundListDataUuid) return;
    setLastRound({
      uuid,
      roundUuid,
      roundListDataUuid,
    });
  }, [uuid, roundUuid, roundListDataUuid]);

  useEffect(() => {
    async function getUserInfo() {
      try {
        if (!roundUuid) return;

        const roundDocRef = firestore()
          .collection("rounds")
          .doc(roundUuid as string);
        const roundDocSnap = await roundDocRef.get();
        if (roundDocSnap.exists) {
          const roundData = roundDocSnap.data() as Round;
          setRoundData(roundData);

          const contractorDocRef = firestore()
            .collection("contractors")
            .doc(roundData.contractorUuid);
          const contractorDocSnap = await contractorDocRef.get();
          if (contractorDocSnap.exists) {
            setContractorData(contractorDocSnap.data() as Contractor);
          }
        }
      } catch (err) {
        logCatchErr(err);
      }
    }
    getUserInfo();
  }, [roundUuid]);

  if (!roundData || !contractorData || roundsListDataLoading || isLoadingQrCode)
    return <LoadingSpinner text="Cargando..." />;

  if (!roundsListData || roundsListData.length === 0)
    return (
      <ErrorComponent text="No se encontraron Rondas para el día seleccionado" />
    );

  return (
    <>
      <MainHeader roundData={roundData} roundsListData={roundsListData} />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(contractorData.lat as unknown as string),
            longitude: parseFloat(contractorData.lng as unknown as string),
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
          {roundsListData
            .filter((x) => x.uuid === roundListDataUuid)[0]
            ?.roundsForTheDay.filter(
              (roundByDay) => roundByDay.uuid === uuid
            )[0]
            .locations.map((location, index: number) => {
              return (
                <Marker
                  zIndex={888}
                  key={`${id}${index}`}
                  coordinate={{
                    latitude: parseFloat(location.lat as unknown as string),
                    longitude: parseFloat(location.lng as unknown as string),
                  }}
                >
                  <CustomMarker
                    fontSize={14}
                    index={index}
                    isChecked={location.status === Status.Check}
                  />
                </Marker>
              );
            })}
        </MapView>
          {roundsListData
          .filter((x) => x.uuid === roundListDataUuid)[0]
          ?.roundsForTheDay.filter(
            (roundByDay) => roundByDay.uuid === uuid
          )[0].startRound.time == "" ? (
          <View
            style={{
              position: "absolute",
              top: "80%",
              left: "35%",
              alignSelf: "flex-end",
            }}
          >
            <RoundButton
              roundListDataUuid={roundListDataUuid as string}
              roundByDayData={
                roundsListData
                  .filter((x) => x.uuid === roundListDataUuid)[0]
                  ?.roundsForTheDay.filter(
                    (roundByDay) => roundByDay.uuid === uuid
                  )[0]
              }
              type="start"
            />
          </View>
        ) : null}
        {roundsListData
          .filter((x) => x.uuid === roundListDataUuid)[0]
          ?.roundsForTheDay.filter(
            (roundByDay) => roundByDay.uuid === uuid
          )[0].startRound.time !== "" &&
          roundsListData
            .filter((x) => x.uuid === roundListDataUuid)[0]
            ?.roundsForTheDay.filter(
              (roundByDay) => roundByDay.uuid === uuid
            )[0]
            .locations.filter((location) => location.status == "pending")
            .length == 0 ? (
          <View
            style={{
              position: "absolute",
              top: "80%",
              left: "35%",
              alignSelf: "flex-end",
            }}
          >
            <RoundButton
              roundListDataUuid={roundListDataUuid as string}
              roundByDayData={
                roundsListData
                  .filter((x) => x.uuid === roundListDataUuid)[0]
                  ?.roundsForTheDay.filter(
                    (roundByDay) => roundByDay.uuid === uuid
                  )[0]
              }
              type="end"
            />
          </View>
        ) : null}

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
