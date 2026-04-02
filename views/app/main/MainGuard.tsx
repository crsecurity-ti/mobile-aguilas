import React from "react";
import { FlatList } from "react-native";

import AccessCard from "./cards/AccessCard";
import AccessWorkerCard from "./cards/AccessWorkerCard";
import EventsCard from "./cards/EventsCard";
import PanicButton from "./cards/PanicButton";
import RoundsCard from "./cards/RoundsCard";
import HourManagementCard from "./cards/HourManagementCard";

const MainGuard = () => {
  const data = [
    { id: "hourManagement", component: <HourManagementCard /> },
    { id: "rounds", component: <RoundsCard role="guard" /> },
    { id: "events", component: <EventsCard /> },
    { id: "access", component: <AccessCard /> },
    { id: "access-worker", component: <AccessWorkerCard /> },
    { id: "panic-button", component: <PanicButton /> },
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
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
};

export default MainGuard;
