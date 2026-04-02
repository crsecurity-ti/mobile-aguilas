import { useState } from "react";
import { Dimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import MapLocations from "../../views/app/map/tabs/MapLocations";
import RenderTabBar from "../../views/app/map/RenderTabBar";
import ListLocations from "../../views/app/map/tabs/ListLocations";

const initialLayout = {
  width: Dimensions.get("window").width,
};

const renderScene = SceneMap({
  map: MapLocations,
  list: ListLocations,
});

export default function Map() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "map", title: "Mapa" },
    { key: "list", title: "Listado" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={(props) => (
        <RenderTabBar {...props} setIndex={setIndex} index={index} />
      )}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}
