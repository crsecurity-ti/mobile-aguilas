const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// FirebaseFirestoreInternal 11.8.0 requiere gRPC-Core ~> 1.65.0 (solo pre-release en CocoaPods).
// Pinear Firebase iOS SDK a 11.6.0 que usa gRPC-Core ~> 1.64.x (estable).
module.exports = function withGrpcFix(config) {
  return withDangerousMod(config, [
    "ios",
    (mod) => {
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      const marker = "# Firebase iOS SDK version pin - gRPC-Core fix";
      if (!contents.includes(marker)) {
        contents = `${marker}\n$FirebaseSDKVersion = '11.6.0'\n\n` + contents;
        fs.writeFileSync(podfilePath, contents);
      }

      return mod;
    },
  ]);
};
