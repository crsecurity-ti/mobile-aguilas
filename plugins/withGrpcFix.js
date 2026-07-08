const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Fix 1: gRPC-Core 1.65.5 está marcado como pre-release en CocoaPods CDN.
//         Declararlo explícitamente dentro del target fuerza la instalación.
//
// Fix 2: react-native-vision-camera-face-detector@1.8.1 tiene bug en su podspec:
//         declara "GoogleMLKit/FaceDetection" (umbrella viejo, incompatible con Firebase 11.x)
//         pero su código Swift importa "MLKitFaceDetection" (standalone moderno).
//         El pre_install hook parchea el podspec en runtime para usar los pods correctos.

const GRPC_FIX_MARKER = "# gRPC-Core pre-release explicit version fix";
const MLKIT_FIX_MARKER = "# VisionCameraFaceDetector podspec patch";

const PRE_INSTALL_BLOCK = `
${MLKIT_FIX_MARKER}
pre_install do |installer|
  installer.pod_targets.select { |p| p.name == 'VisionCameraFaceDetector' }.each do |target|
    target.specs.each do |spec|
      spec.dependencies.delete_if { |d| d.name.start_with?('GoogleMLKit') }
      spec.dependencies << Pod::Dependency.new('MLKitFaceDetection', '~> 6.0')
      spec.dependencies << Pod::Dependency.new('MLKitVision', '~> 6.0')
    end
  end
end
`;

module.exports = function withGrpcFix(config) {
  return withDangerousMod(config, [
    "ios",
    (mod) => {
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      // Fix 1: agregar gRPC pods explícitos dentro del target (antes de post_install)
      if (!contents.includes(GRPC_FIX_MARKER)) {
        contents = contents.replace(
          "\n  post_install do |installer|",
          `\n  ${GRPC_FIX_MARKER}\n  pod 'gRPC-Core', '1.65.5'\n  pod 'gRPC-C++', '1.65.5'\n\n  post_install do |installer|`
        );
      }

      // Fix 2: pre_install hook para parchear VisionCameraFaceDetector
      if (!contents.includes(MLKIT_FIX_MARKER)) {
        contents = contents.replace(
          "\ntarget 'AguilasSeguridad' do",
          `${PRE_INSTALL_BLOCK}\ntarget 'AguilasSeguridad' do`
        );
      }

      fs.writeFileSync(podfilePath, contents);
      return mod;
    },
  ]);
};
