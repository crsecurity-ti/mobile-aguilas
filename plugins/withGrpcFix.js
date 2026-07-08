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
// Fix 5: FirebaseAuth es Swift pod y necesita use_frameworks! :linkage => :static
//         para generar FirebaseAuth-Swift.h accesible por otros pods (RNFBStorage, etc.).
//         use_frameworks! :static es la solución correcta — evita hackear modular_headers
//         pod-por-pod, que no resuelve el problema de headers Swift generados.

const GRPC_FIX_MARKER = "# gRPC-Core / Firebase sub-pods version fix";

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

      // --- Fix 5: activar use_frameworks! :static via Podfile.properties.json ---
      const podfilePropertiesPath = path.join(
        mod.modRequest.platformProjectRoot,
        "Podfile.properties.json"
      );
      if (fs.existsSync(podfilePropertiesPath)) {
        const props = JSON.parse(fs.readFileSync(podfilePropertiesPath, "utf8"));
        props["ios.useFrameworks"] = "static";
        fs.writeFileSync(podfilePropertiesPath, JSON.stringify(props, null, 2));
      }

      // --- Fix 1 + 3 + 4: parchear Podfile ---
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      // Fix 4: sobreescribir deployment target directamente
      contents = contents.replace(
        /platform :ios, podfile_properties\['ios\.deploymentTarget'\] \|\| '[^']+'/,
        "platform :ios, '16.0'"
      );

      // Fix 6: use_frameworks! :static causa "Multiple commands produce libsql.h"
      //         en op-sqlite porque dos build phases copian el mismo header.
      //         disable_input_output_paths evita que Xcode detecte el conflicto.
      contents = contents.replace(
        "install! 'cocoapods',\n  :deterministic_uuids => false",
        "install! 'cocoapods',\n  :deterministic_uuids => false,\n  :disable_input_output_paths => true"
      );

      if (!contents.includes(GRPC_FIX_MARKER)) {
        const pods = [
          "  # gRPC-Core pre-release — declarar explícitamente para forzar instalación",
          "  pod 'gRPC-Core', '1.65.5'",
          "  pod 'gRPC-C++', '1.65.5'",
          "",
          "  # Firebase sub-pods — pinar a 11.8.x para evitar que resuelvan a 11.9.0",
          "  pod 'FirebaseInstallations', '~> 11.8.0'",
          "  pod 'FirebaseSessions', '~> 11.8.0'",
          "  pod 'FirebaseCoreExtension', '~> 11.8.0'",
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
