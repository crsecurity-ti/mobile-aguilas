import auth from "@react-native-firebase/auth";
import React from "react";

import { clearProcessStatus } from "../database/services/processStatus.service";
import { useUserStore } from "../store/auth";
import ItemMenu from "../views/sidebar/menu/ItemMenu";
import { clearImagesUploadRepository } from "../database/services/imagesUpload.service";
import * as TaskManager from "expo-task-manager";

const MenuLogoutButton = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  return (
    <ItemMenu
      text="Desconectar"
      onPress={() => {
        TaskManager.unregisterAllTasksAsync();
        clearProcessStatus();
        clearImagesUploadRepository();
        auth().signOut();
        clearUser();
      }}
      className="text-red-700"
    />
  );
};

export default MenuLogoutButton;
