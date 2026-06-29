const { withProjectBuildGradle } = require("@expo/config-plugins");

const MARKER = "ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES";
const BLOCK = `
// Android 15: 16KB page size support for all native modules
subprojects {
    plugins.withId("com.android.library") {
        android {
            defaultConfig {
                externalNativeBuild {
                    cmake {
                        arguments "-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"
                    }
                }
            }
        }
    }
}
`;

module.exports = function withAndroid16kbSupport(config) {
    return withProjectBuildGradle(config, (mod) => {
        if (!mod.modResults.contents.includes(MARKER)) {
            mod.modResults.contents += BLOCK;
        }
        return mod;
    });
};
