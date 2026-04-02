import React, { useId } from "react";
import { SectionList, View } from "react-native";

import ButtonValidateVisit from "./ButtonValidateVisit";
import ListLocationItem from "./ListLocationItem";
import RoundButton from "./RoundButton";
import { RoundSupervisor } from "./types";

const ListLocations = ({
  roundSupervisor,
}: {
  roundSupervisor: RoundSupervisor;
}) => {
  const id = useId();

  return (
    <>
      {roundSupervisor.startRound?.time !== "" &&
      roundSupervisor.endRound?.time === "" ? (
        <ButtonValidateVisit roundSupervisor={roundSupervisor} />
      ) : null}
      <SectionList
        sections={[{ title: "asd", data: roundSupervisor.locations }]}
        keyExtractor={(item, index) => item.uuid ?? id + index}
        renderItem={({ item, index }) => (
          <ListLocationItem
            item={item}
            index={index}
            roundSupervisor={roundSupervisor}
          />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              width: "100%",
            }}
          />
        )}
        renderSectionHeader={() => (
          <RoundButton roundSupervisor={roundSupervisor} type="start" />
        )}
        renderSectionFooter={() => (
          <RoundButton roundSupervisor={roundSupervisor} type="end" />
        )}
      />
    </>
  );
};

export default ListLocations;
