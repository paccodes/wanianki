import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";

export default defineConfigWithVueTs([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  vueTsConfigs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
  eslintPluginPrettier,
]);
