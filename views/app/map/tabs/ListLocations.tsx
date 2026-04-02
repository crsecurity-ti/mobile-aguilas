import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useId } from "react";
import { SectionList, Text } from "react-native";

import RoundButton from "../components/RoundButton";
import { ListLocationItem } from "../../../../components/ListLocationItem";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import useRoundGuardsByDay from "../../../../hooks/useRoundGuardsByDay";
import ButtonValidateVisitGuard from "../../rounds/ButtonValidateVisitGuard";
import ErrorComponent from "../../../../components/ErrorComponent";

const ListLocations = () => {
  const id = useId();
  const router = useRouter();

  const { uuid, roundListDataUuid } = useLocalSearchParams();

  const { roundsListData, roundsListDataLoading } = useRoundGuardsByDay();

  if (roundsListDataLoading) return <LoadingSpinner text="Cargando..." />;

  if (!roundsListData || roundsListData.length === 0)
    return <ErrorComponent text="Error Cargando el listado" />;

  const roundByDayData = roundsListData
    .filter((x) => x.uuid === roundListDataUuid)[0]
    ?.roundsForTheDay.filter(
      (roundByDay) => roundByDay.uuid === uuid,
    )[0];

  if (!roundByDayData) {
    router.navigate({
      pathname: "home",
      params: {
        roundListDataUuid,
      },
    });
    return <Text>No se encontró la ronda</Text>;
  }

  return (
    <>
      {roundByDayData.startRound?.time !== "" &&
      roundByDayData.endRound?.time === "" ? (
        <ButtonValidateVisitGuard
          uuid={uuid as string}
          roundUuid={roundListDataUuid as string}
          roundListDataUuid={roundListDataUuid as string}
          roundData={roundByDayData}
          roundsListData={roundsListData}
        />
      ) : null}
      <SectionList
        className="mb-4"
        sections={[
          {
            title: "test",
            data: roundsListData
              .filter((x) => x.uuid === roundListDataUuid)[0]
              ?.roundsForTheDay.filter(
                (roundByDay) => roundByDay.uuid === uuid,
              )[0].locations,
          },
        ]}
        keyExtractor={(item, index) =>
          item.id ?? `${id}-${item.uuid}-${index}`
        }
        renderItem={({ item, index }) => (
          <ListLocationItem
            key={`${item.id} + ${index}`}
            item={item}
            index={index}
            setCurrentLocationSelected={() => {}}
            handlePresentModalPress={() => {}}
          />
        )}
        renderSectionHeader={() => (
          <RoundButton
            roundListDataUuid={roundListDataUuid as string}
            roundByDayData={
              roundsListData
                .filter((x) => x.uuid === roundListDataUuid)[0]
                ?.roundsForTheDay.filter(
                  (roundByDay) => roundByDay.uuid === uuid,
                )[0]
            }
            type="start"
          />
        )}
        renderSectionFooter={() => (
          <RoundButton
            roundListDataUuid={roundListDataUuid as string}
            roundByDayData={
              roundsListData
                .filter((x) => x.uuid === roundListDataUuid)[0]
                ?.roundsForTheDay.filter(
                  (roundByDay) => roundByDay.uuid === uuid,
                )[0]
            }
            type="end"
          />
        )}
      />
    </>
  );
};

export default ListLocations;
