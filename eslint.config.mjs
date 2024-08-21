import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: "@typescript-eslint/parser",
    },
    rules: {
      "quotes": ["error", "double"], // Enforce double quotes
      "indent": ["error", "tab"],     // Enforce tabs for indentation
      "prettier/prettier": [
        "error",
        {
          "singleQuote": false, // Double quotes
          "useTabs": true,      // Tabs for indentation
          "tabWidth": 2         // Set tab width to 2 spaces
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,  // Use as an object, no "extends"
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,          // Disable conflicting ESLint rules
  eslintPluginPrettier,          // Run Prettier as an ESLint rule
  {
    overrides: [
      {
        files: ["server/**/*.ts"],
        languageOptions: {
          globals: globals.node,  // Apply Node.js globals for server-side code
        },
      },
      {
        files: ["client/**/*.tsx"],
        languageOptions: {
          globals: globals.browser,  // Apply browser globals for client-side code
        },
      },
    ],
  },
];
