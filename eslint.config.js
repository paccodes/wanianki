import eslintConfigPrettier from "@vue/eslint-config-prettier";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

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
  ...typescriptEslint.configs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
  },
  {
    rules: {
      ...eslintConfigPrettier.rules,
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
  eslintPluginPrettier,
]);
