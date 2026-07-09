const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Fix 1: gRPC-Core 1.65.5 es pre-release en CocoaPods CDN — declarar explícitamente.
//
// Fix 2: react-native-vision-camera-face-detector@1.8.1 bug en podspec:
//         declara "GoogleMLKit/FaceDetection" (umbrella viejo) pero código Swift
//         importa "MLKitFaceDetection" (standalone). Parchamos el podspec en node_modules.
//
// Fix 3: FirebaseInstallations/Sessions resuelven a 11.9.0 causando conflicto
//         de FirebaseCore ~> 11.8.0 vs ~> 11.9.0. Pinamos a ~> 11.8.0.
//
// Fix 4: MLKitFaceDetection 6.x requiere iOS 16.0 mínimo.
//
// Fix 12 (solución real): Firebase Storage/Auth/Firestore son pods Swift que no
//         exponen sus headers a targets ObjC sin use_frameworks!. Los fixes 5-11
//         atacaban síntomas de este problema. La solución es use_frameworks!
//         :linkage => :static (activado via expo-build-properties en app.config.js).
//         El conflicto op-sqlite citado en Fix 5 (libsql.h duplicado) se resuelve
//         con un pre_install hook que fuerza op-sqlite a static_library.

const GRPC_FIX_MARKER = "# gRPC-Core / Firebase sub-pods version fix";
const PRE_INSTALL_MARKER = "# Fix op-sqlite static_library bajo use_frameworks!";

module.exports = function withGrpcFix(config) {
  return withDangerousMod(config, [
    "ios",
    (mod) => {
      // --- Fix 2: parchear podspec de VisionCameraFaceDetector ---
      const podspecPath = path.join(
        mod.modRequest.projectRoot,
        "node_modules/react-native-vision-camera-face-detector/VisionCameraFaceDetector.podspec"
      );

      if (fs.existsSync(podspecPath)) {
        let podspec = fs.readFileSync(podspecPath, "utf8");
        if (podspec.includes('GoogleMLKit/FaceDetection')) {
          podspec = podspec.replace(
            's.dependency "GoogleMLKit/FaceDetection"',
            's.dependency "MLKitFaceDetection", "~> 6.0"'
          );
          fs.writeFileSync(podspecPath, podspec);
        }
      }

      // --- Fix 1 + 3 + 4 + 12: parchear Podfile ---
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      // Fix 4: deployment target 16.0 para MLKitFaceDetection 6.x
      contents = contents.replace(
        /platform :ios, podfile_properties\['ios\.deploymentTarget'\] \|\| '[^']+'/,
        "platform :ios, '16.0'"
      );

      // Fix 12: asegurar ios.useFrameworks = "static" en Podfile.properties.json
      // (expo-build-properties también lo escribe, esto es safety net por si corre tarde)
      const podfilePropertiesPath = path.join(
        mod.modRequest.platformProjectRoot,
        "Podfile.properties.json"
      );
      if (fs.existsSync(podfilePropertiesPath)) {
        const props = JSON.parse(fs.readFileSync(podfilePropertiesPath, "utf8"));
        props["ios.useFrameworks"] = "static";
        fs.writeFileSync(podfilePropertiesPath, JSON.stringify(props, null, 2));
      }

      // Fix 12: pre_install hook — op-sqlite como static_library para evitar
      // conflicto libsql.h duplicado bajo use_frameworks! :linkage => :static
      if (!contents.includes(PRE_INSTALL_MARKER)) {
        const preInstallFix = [
          PRE_INSTALL_MARKER,
          "pre_install do |installer|",
          "  installer.pod_targets.each do |pod|",
          "    if pod.name == 'op-sqlite'",
          "      def pod.build_type",
          "        Pod::BuildType.static_library",
          "      end",
          "    end",
          "  end",
          "end",
          "",
        ].join("\n");

        contents = contents.replace(
          "\ntarget 'AguilasSeguridad' do",
          `\n${preInstallFix}\ntarget 'AguilasSeguridad' do`
        );
      }

      // Fix 1 + 3: pods explícitos dentro del target
      if (!contents.includes(GRPC_FIX_MARKER)) {
        const pods = [
          "  # gRPC-Core pre-release — declarar explícitamente para forzar instalación",
          "  pod 'gRPC-Core', '1.65.5'",
          "  pod 'gRPC-C++', '1.65.5'",
          "",
          "  # Firebase ObjC pods: pinar versión + modular_headers para Swift interop.",
          "  # NO usar use_modular_headers! global — rompe gRPC-Core module maps.",
          "  pod 'FirebaseInstallations', '~> 11.8.0', :modular_headers => true",
          "  pod 'FirebaseSessions', '~> 11.8.0', :modular_headers => true",
          "  pod 'FirebaseCoreExtension', '~> 11.8.0', :modular_headers => true",
          "  pod 'FirebaseAuth', :modular_headers => true",
          "  pod 'FirebaseCore', :modular_headers => true",
          "  pod 'FirebaseCoreInternal', :modular_headers => true",
          "  pod 'FirebaseFirestoreInternal', :modular_headers => true",
          "  pod 'FirebaseAuthInterop', :modular_headers => true",
          "  pod 'FirebaseAppCheckInterop', :modular_headers => true",
          "  pod 'GoogleUtilities', :modular_headers => true",
          "  pod 'GoogleDataTransport', :modular_headers => true",
          "  pod 'RecaptchaInterop', :modular_headers => true",
          "  pod 'leveldb-library', :modular_headers => true",
          "  pod 'nanopb', :modular_headers => true",
        ].join("\n");

        contents = contents.replace(
          "\n  post_install do |installer|",
          `\n  ${GRPC_FIX_MARKER}\n${pods}\n\n  post_install do |installer|`
        );
      }

      fs.writeFileSync(podfilePath, contents);

      return mod;
    },
  ]);
};
