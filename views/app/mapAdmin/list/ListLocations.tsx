import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useId, useRef, useState } from "react";
import { View, SectionList, Text, StyleSheet } from "react-native";

import NFCButton from "./NFCButton";
import { ListLocationItem } from "../../../../components/ListLocationItem";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import useRound from "../../../../hooks/useRound";
import { LocationType } from "../../../../types";

interface LocationCustom extends LocationType {
  position: number;
}

const ListLocations = () => {
  const id = useId();

  const { roundUuid } = useLocalSearchParams();

  const { roundData, contractorData, loading } = useRound({
    roundUuid: roundUuid as string,
  });

  const [currentLocationSelected, setCurrentLocationSelected] =
    useState<LocationCustom>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, []);

  if (!roundData || !contractorData || loading)
    return <LoadingSpinner text="Cargando..." />;

  return (
    <BottomSheetModalProvider>
      <SectionList
        sections={[{ title: "asd", data: roundData.locations }]}
        keyExtractor={(item, index) => item.id ?? id + index}
        renderItem={({ item, index }) => (
          <ListLocationItem
            key={item.uuid}
            setCurrentLocationSelected={setCurrentLocationSelected}
            handlePresentModalPress={handlePresentModalPress}
            item={item}
            index={index}
          />
        )}
      />
      <BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <View className="flex-1 justify-evenly mx-5 mb-10">
            <Text className="text-center">
              Nombre:{" "}
              <Text className="font-semibold">
                {currentLocationSelected?.name}
              </Text>
            </Text>
            <Text className="text-center">
              Ubicación:{" "}
              <Text className="font-semibold">
                {(currentLocationSelected?.position || 0) + 1}
              </Text>
            </Text>
            <NFCButton nfcCode={currentLocationSelected?.nfcCode ?? "123123"} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ListLocations;

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
