import React from "react";

import { startQueue } from "../utils/TaskQueueDB/utils/queueUtils";
import ItemMenu from "../views/sidebar/menu/ItemMenu";

const MenuSyncButton = () => {
  return (
    <ItemMenu
      text="Sincronizar imágenes"
      onPress={() => startQueue()}
      className="text-blue-700"
    />
  );
};

export default MenuSyncButton;
