import "dotenv/config";
import { withGradleProperties } from "@expo/config-plugins";

const packageName = "com.aguilasseguridad.asmobileapp";

export default {
  expo: {
    name: "AguilasSeguridad",
    slug: "ASMobileApp",
    version: "1.7.7",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    plugins: [
      (config) =>
        withGradleProperties(config, (mod) => {
          mod.modResults = mod.modResults.filter(
            (p) => p.key !== "reactNativeArchitectures"
          );
          mod.modResults.push({
            type: "property",
            key: "reactNativeArchitectures",
            value: "armeabi-v7a,arm64-v8a",
          });
          return mod;
        }),
      "./plugins/withAndroid16kbSupport",
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
      "./plugins/withBackgroundActions.js",
      "./plugins/withGrpcFix.js",
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "16.0",
            useFrameworks: "static",
          },
          android: {
            minSdkVersion: 26,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
            androidGradlePluginVersion: "8.7.3",
            ndkVersion: "28.0.12433566",
            enableProguardInRelease: true,
            packagingOptions: {
              exclude: ["**/x86_64/**", "**/x86/**"],
              pickFirst: [
                "**/libjsi.so",
                "**/libreactnative.so",
                "**/libc++_shared.so",
                "**/libfbjni.so",
              ],
              jniLibs: {
                useLegacyPackaging: false,
              },
            },
          },
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Aguilas Security to use your location.",
          locationAlwaysPermission:
            "Allow Aguilas Security to use your location in the background.",
          locationWhenInUsePermission:
            "Allow Aguilas Security to use your location.",
          isIosBackgroundLocationEnabled: true,
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
          "Esta app utiliza la cámara para validar los codigos QR.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Esta app necesita acceso a tu ubicación para registrar rondas de seguridad.",
        NSLocationAlwaysUsageDescription:
          "Esta app necesita acceso a tu ubicación en segundo plano para registrar rondas de seguridad.",
        NSLocationWhenInUseUsageDescription:
          "Esta app necesita acceso a tu ubicación para registrar rondas de seguridad.",
        NFCReaderUsageDescription:
          "Esta app utiliza NFC para validar puntos de control de seguridad.",
        UIBackgroundModes: ["location", "fetch", "remote-notification"],
      },
      entitlements: {
        "com.apple.developer.nfc.readersession.formats": ["NDEF", "TAG"],
        "aps-environment": "production",
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? "./ios/GoogleService-Info.plist",
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
      versionCode: 38,
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
