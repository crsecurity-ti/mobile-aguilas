const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withGrpcFix(config) {
  return withDangerousMod(config, [
    "ios",
    (mod) => {
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      const marker = "# gRPC-Core pre-release fix";
      if (!contents.includes(marker)) {
        // Insert before post_install block (still inside target block)
        contents = contents.replace(
          /(\n\s*post_install do \|installer\|)/,
          `\n  ${marker}\n  pod 'gRPC-Core', '1.65.5'\n$1`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return mod;
    },
  ]);
};
