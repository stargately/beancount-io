// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "dist/*",
      "__generated__",
      "node_modules/*",
      "src/generated-graphql/*",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
