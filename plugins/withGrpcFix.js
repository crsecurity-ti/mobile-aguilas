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
// Fix 5: RNFBStorage importa FirebaseAuth/FirebaseAuth-Swift.h que no se genera
//         en modo static library. DEFINES_MODULE = YES fuerza la generación del
//         module map y el Swift umbrella header sin necesitar use_frameworks!.
//         (use_frameworks! :static fue descartado — rompe op-sqlite con libsql.h duplicado)

const GRPC_FIX_MARKER = "# gRPC-Core / Firebase sub-pods version fix";
const POST_INSTALL_MARKER = "# Fix FirebaseAuth DEFINES_MODULE";

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

      // --- Asegurar que use_frameworks NO esté activado (revertir si fue seteado) ---
      const podfilePropertiesPath = path.join(
        mod.modRequest.platformProjectRoot,
        "Podfile.properties.json"
      );
      if (fs.existsSync(podfilePropertiesPath)) {
        const props = JSON.parse(fs.readFileSync(podfilePropertiesPath, "utf8"));
        delete props["ios.useFrameworks"];
        fs.writeFileSync(podfilePropertiesPath, JSON.stringify(props, null, 2));
      }

      // --- Fix 1 + 3 + 4 + 5: parchear Podfile ---
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      // Fix 4: deployment target 16.0 para MLKitFaceDetection 6.x
      contents = contents.replace(
        /platform :ios, podfile_properties\['ios\.deploymentTarget'\] \|\| '[^']+'/,
        "platform :ios, '16.0'"
      );

      // Fix 1 + 3: pods explícitos dentro del target
      if (!contents.includes(GRPC_FIX_MARKER)) {
        const pods = [
          "  # gRPC-Core pre-release — declarar explícitamente para forzar instalación",
          "  pod 'gRPC-Core', '1.65.5'",
          "  pod 'gRPC-C++', '1.65.5'",
          "",
          "  # Firebase sub-pods — pinar a 11.8.x para evitar conflicto FirebaseCore",
          "  pod 'FirebaseInstallations', '~> 11.8.0'",
          "  pod 'FirebaseSessions', '~> 11.8.0'",
          "  pod 'FirebaseCoreExtension', '~> 11.8.0'",
        ].join("\n");

        contents = contents.replace(
          "\n  post_install do |installer|",
          `\n  ${GRPC_FIX_MARKER}\n${pods}\n\n  post_install do |installer|`
        );
      }

      // Fix 5: DEFINES_MODULE = YES para FirebaseAuth dentro del post_install
      // Insertamos antes de installer.target_installation_results (siempre presente)
      if (!contents.includes(POST_INSTALL_MARKER)) {
        const firebaseAuthFix = [
          `    ${POST_INSTALL_MARKER}`,
          "    installer.pods_project.targets.each do |target|",
          "      if target.name == 'FirebaseAuth'",
          "        target.build_configurations.each do |cfg|",
          "          cfg.build_settings['DEFINES_MODULE'] = 'YES'",
          "        end",
          "      end",
          "    end",
          "",
        ].join("\n");

        contents = contents.replace(
          "\n    installer.target_installation_results",
          `\n${firebaseAuthFix}    installer.target_installation_results`
        );
      }

      fs.writeFileSync(podfilePath, contents);

      return mod;
    },
  ]);
};
