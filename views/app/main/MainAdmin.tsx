import React from "react";
import { FlatList } from "react-native";

import AdminGuardCard from "./cards/AdminGuardCard";
import AdminSupervisorCard from "./cards/AdminSupervisorCard";

const MainAdmin = () => {
  const data = [
    { id: "guards", component: <AdminGuardCard /> },
    { id: "supervisors", component: <AdminSupervisorCard /> },
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

export default MainAdmin;
