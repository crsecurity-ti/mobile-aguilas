import "dotenv/config";

const isProduction = process.env.APP_ENV === "production";
const packageName = isProduction
  ? "com.aguilasseguridad.asmobileapp"
  : "com.aguilasseguridadqa1.asmobileapp";

export default {
  expo: {
    name: "AguilasSeguridad",
    slug: "ASMobileApp",
    version: "1.7.4",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      "./plugins/withBackgroundActions.js",
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 26,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            enableProguardInRelease: true,
          },
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Aguilas Security to use your location.",
        },
      ],
      [
        "react-native-nfc-manager",
        {
          nfcPermission: "Custom permission message",
          selectIdentifiers: ["A0000002471001"],
          systemCodes: ["8008"],
          includeNdefEntitlement: false,
        },
      ],
    ],
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      infoPlist: {
        NSCameraUsageDescription:
          "Esta app utiliza la cámara para validar los codigos qr.",
        UIBackgroundModes: ["location", "fetch", "remote-notification"],
      },
      bundleIdentifier: packageName,
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./android/app/google-services.json",
      config: {
        googleMaps: {
          apiKey: "AIzaSyC_zKTBKfT5D0zHOLFeq-WIMfxsNCcCbXI",
        },
      },
      package: packageName,
      permissions: [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE_DATA_SYNC",
        "com.google.android.gms.permission.AD_ID",
      ],
      versionCode: 29,
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      eas: {
        projectId: "bb3398f9-a4e2-4dba-943a-a666c0433803",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    },
  },
};
