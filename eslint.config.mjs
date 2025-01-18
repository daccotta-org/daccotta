// import globals from "globals"
// import pluginJs from "@eslint/js"
// import tseslint from "@typescript-eslint/eslint-plugin"
// import pluginReact from "eslint-plugin-react"
// import eslintConfigPrettier from "eslint-config-prettier"
// import eslintPluginPrettier from "eslint-plugin-prettier"

// export default [
//     {
//         files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
//         languageOptions: {
//             globals: globals.browser,
//             parser: "@typescript-eslint/parser",
//         },
//         rules: {
//             quotes: ["error", "double"], // Enforce double quotes
//             indent: ["error", "tab"], // Enforce tabs for indentation
//             "prettier/prettier": [
//                 "error",
//                 {
//                     singleQuote: false, // Double quotes
//                     useTabs: true, // Tabs for indentation
//                     tabWidth: 2, // Set tab width to 2 spaces
//                 },
//             ],
//         },
//     },
//     pluginJs.configs.recommended,
//     tseslint.configs.recommended, // Use as an object, no "extends"
//     pluginReact.configs.flat.recommended,
//     eslintConfigPrettier, // Disable conflicting ESLint rules
//     eslintPluginPrettier, // Run Prettier as an ESLint rule
//     {
//         overrides: [
//             {
//                 files: ["server/**/*.ts"],
//                 languageOptions: {
//                     globals: globals.node, // Apply Node.js globals for server-side code
//                 },
//             },
//             {
//                 files: ["client/**/*.tsx"],
//                 languageOptions: {
//                     globals: globals.browser, // Apply browser globals for client-side code
//                 },
//             },
//         ],
//     },
// ]

import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import pluginReact from "eslint-plugin-react"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettier from "eslint-plugin-prettier"

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            globals: globals.browser,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                project: "./tsconfig.json", // Make sure this points to your tsconfig
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react: pluginReact,
            prettier: eslintPluginPrettier,
        },
        rules: {
            quotes: ["error", "double"],
            indent: ["error", "tab"],
            "@typescript-eslint/no-unused-vars": [
                "off",
                {
                    // Changed to warn
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                    destructuredArrayIgnorePattern: "^_",
                },
            ],
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    useTabs: true,
                    tabWidth: 2,
                },
            ],
        },
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintConfigPrettier,
    {
        overrides: [
            {
                files: [
                    "server/**/*.ts",
                    "client/**/*.{js,mjs,cjs,ts,jsx,tsx}",
                ],
                languageOptions: {
                    globals: globals.node,
                },
                rules: {
                    "@typescript-eslint/no-unused-vars": [
                        "warn",
                        {
                            // Changed to warn
                            argsIgnorePattern: "^_",
                            varsIgnorePattern: "^_",
                            ignoreRestSiblings: true,
                        },
                    ],
                },
            },
            {
                files: ["client/**/*.tsx"],
                languageOptions: {
                    globals: globals.browser,
                },
            },
        ],
    },
]
