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
        // Insert before the closing "end" of the target block
        contents = contents.replace(
          /^end\s*$/m,
          `  ${marker}\n  pod 'gRPC-Core', '1.65.5'\nend`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return mod;
    },
  ]);
};
