import { useRouter } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

import ItemMenu from "./ItemMenu";
import MenuLogoutButton from "../../../components/MenuLogoutButton";
import MenuSyncButton from "../../../components/MenuSyncButton";
import { useUserStore } from "../../../store/auth";
import { routes } from "../../../utils/constants";

const Menu = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const isAllowed = (roles: string[]) =>
    roles.some((role) => user?.userInformation.role === role);

  const renderItem = ({
    item,
  }: {
    item: {
      name: string;
      drawerLabel: string;
      roles: string[];
    };
  }) => {
    if (isAllowed(item.roles)) {
      return (
        <ItemMenu
          text={item.drawerLabel}
          onPress={() => router.navigate({ pathname: item.name })}
        />
      );
    }
    return null;
  };

  return (
    <FlatList
      className="mt-20"
      data={routes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      contentContainerStyle={{ paddingBottom: 80 }}
      ListFooterComponent={
        <>
          {user?.userInformation.role !== "admin" && <MenuSyncButton />}
          <MenuLogoutButton />
        </>
      }
    />
  );
};

export default Menu;
