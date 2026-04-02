import "../assets/css/global.css";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Font from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import Toast, {
  SuccessToast,
  InfoToast,
  ErrorToast,
} from "react-native-toast-message";

import { logCatchErr } from "../api/utils/crashlytics";
import { SessionProvider } from "../context/auth";

const toastConfig = {
  success: (props: any) => (
    <SuccessToast
      {...props}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/",
  auth: {
    initialRouteName: "(auth)/signIn",
  },
  app: {
    initialRouteName: "(app)/home",
  },
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
          ...FontAwesome.font,
        });
      } catch (e) {
        logCatchErr(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function hide() {
      await SplashScreen.hideAsync();
    }
    if (appIsReady) {
      hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}>
      <SessionProvider>
        <Slot />
        <Toast config={toastConfig} />
      </SessionProvider>
    </ThemeProvider>
  );
}
