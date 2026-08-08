import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "warn",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
            "@typescript-eslint/no-unused-expressions": "warn",
            "react-hooks/rules-of-hooks": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "no-empty": "warn",
            "no-prototype-builtins": "warn",
            "no-useless-escape": "warn",
            "no-constant-binary-expression": "warn",
            "prefer-const": "warn",
        },
    }
)
