module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-worklets-core/plugin",
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      [
        "module-resolver",
        {
          alias: {
            "react-native-sqlite-storage": "react-native-quick-sqlite",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
