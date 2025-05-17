// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import cypress from "eslint-plugin-cypress";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // browser globals like window, document
        ...globals.mocha, // Mocha test globals like describe, it
        ...globals.cypress, // Cypress globals like cy, Cypress
      },
    },
    plugins: {
      cypress, // Cypress plugin only (✅ no js plugin)
    },
    // Spread in ESLint recommended rules (✅ proper for flat config)
    ...js.configs.recommended,
    // Extend Cypress recommended rules
    extends: ["plugin:cypress/recommended"],
    rules: {
      "no-var": "error", // Disallow var
      "no-unused-vars": "error", // Disallow unused variables
      semi: ["error", "always"], // Require semicolons
      "no-console": "error", // Disallow console.log
      "cypress/no-unnecessary-waiting": "off", // Turn off specific Cypress rule
    },
  },
]);
