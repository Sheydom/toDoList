import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Include browser globals
        ...globals.mocha, // Include Mocha globals
      },
    },
    rules: {
      "no-var": "error", // Disallow the use of `var`
      "no-unused-vars": "error", // Disallow unused variables
      semi: ["error", "always"], // Enforce semicolons
      "no-console": "error", // Disallow `console` statements
      cy: "off", // Turn off Cypress-specific rules
    },
    plugins: { js },
    extends: ["js/recommended"], // Use recommended JavaScript rules
  },
]);
