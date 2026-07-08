const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Fix 1: gRPC-Core 1.65.5 está marcado como pre-release en CocoaPods CDN.
//         Declararlo explícitamente dentro del target fuerza la instalación.
//
// Fix 2: react-native-vision-camera-face-detector@1.8.1 bug en podspec:
//         declara "GoogleMLKit/FaceDetection" (umbrella viejo, incompatible con Firebase 11.x)
//         pero su código Swift usa "MLKitFaceDetection" (standalone moderno).
//         Modificamos el podspec en node_modules ANTES de que corra pod install.
//
// Fix 3: FirebaseInstallations y FirebaseSessions resuelven a 11.9.0 aunque Firebase
//         esté en 11.8.0, causando conflicto de FirebaseCore ~> 11.8.0 vs ~> 11.9.0.
//         Pinamos explícitamente a ~> 11.8.0 dentro del target.

const GRPC_FIX_MARKER = "# gRPC-Core / Firebase sub-pods explicit version fix";

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
            's.dependency "MLKitFaceDetection", "~> 6.0"\n  s.dependency "MLKitVision", "~> 6.0"'
          );
          fs.writeFileSync(podspecPath, podspec);
        }
      }

      // --- Fix 1 + 3: parchear Podfile ---
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      if (!contents.includes(GRPC_FIX_MARKER)) {
        const pods = [
          "  # gRPC-Core pre-release — declarar explícitamente para forzar instalación",
          "  pod 'gRPC-Core', '1.65.5'",
          "  pod 'gRPC-C++', '1.65.5'",
          "",
          "  # Firebase sub-pods — pinar a 11.8.x para evitar que resuelvan a 11.9.0",
          "  # y causen conflicto de FirebaseCore ~> 11.8.0 vs ~> 11.9.0",
          "  pod 'FirebaseInstallations', '~> 11.8.0'",
          "  pod 'FirebaseSessions', '~> 11.8.0'",
          "  pod 'FirebaseCoreExtension', '~> 11.8.0'",
        ].join("\n");

        contents = contents.replace(
          "\n  post_install do |installer|",
          `\n  ${GRPC_FIX_MARKER}\n${pods}\n\n  post_install do |installer|`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return mod;
    },
  ]);
};
