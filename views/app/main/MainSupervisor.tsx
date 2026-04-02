import React from "react";
import { FlatList } from "react-native";

import EventsSupervisorCard from "./cards/EventsSupervisorCard";
import RoundsBox from "./cards/RoundsCard";
import HourManagementSupervisorCard from "./cards/HourManagementSupervisorCard";

const MainSupervisor = () => {
  const data = [
    { id: "hourManagement", component: <HourManagementSupervisorCard /> },
    { id: "roundsBox", component: <RoundsBox role="supervisor" /> },
    { id: "eventsSupervisors", component: <EventsSupervisorCard /> },
  ];

  const renderItem = ({
    item,
  }: {
    item: { id: string; component: JSX.Element };
  }) => item.component;

  return (
    <FlatList
      className="flex h-5/6"
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default MainSupervisor;
