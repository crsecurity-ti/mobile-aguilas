import { useState } from "react";
import { Dimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";

import RenderTabBar from "../../views/app/map/RenderTabBar";
import MapLocations from "../../views/app/mapAdmin/MapLocations";
import ListLocations from "../../views/app/mapAdmin/list/ListLocations";

const initialLayout = {
  width: Dimensions.get("window").width,
};

const renderScene = SceneMap({
  map: MapLocations,
  list: ListLocations,
});

export default function ListMap() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "map",
      title: "Mapa",
    },
    {
      key: "list",
      title: "Listado",
    },
  ]);

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={(data) => RenderTabBar({ ...data, setIndex, index })}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}
