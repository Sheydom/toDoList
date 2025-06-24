import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
    },

    ...js.configs.recommended,
    rules: {
      "no-var": "error",
      "no-unused-vars": "error",
      semi: ["error", "always"],
      "no-console": "warn",
    },
  },
]);
