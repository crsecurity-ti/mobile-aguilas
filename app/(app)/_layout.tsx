import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useUserStore } from "../../store/auth";
import { routes } from "../../utils/constants";
import Menu from "../../views/sidebar/menu";
import { initializeDatabase } from "../../database";

export default function AppLayout() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const connect = async () => {
      await initializeDatabase();
    };
    connect();
  }, []);

  const isAllowed = (roles: string[]) =>
    roles.some((role) => user?.userInformation.role === role);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="rounds"
        drawerContent={() => <Menu />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#155e75",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {routes.map((route) => (
          <Drawer.Screen
            key={route.name}
            name={route.name}
            options={{
              drawerItemStyle: {
                display: isAllowed(route.roles) ? "flex" : "none",
              },
              headerShown:
                route.name === "camera-face-recognition" ? false : true,
              title: route.drawerLabel,
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
