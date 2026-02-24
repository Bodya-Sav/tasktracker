import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
  {
    ignores: [
      "dist",
      "node_modules",
      ".DS_Store",
      ".env",
      ".env.*",
      "**/*.config.js",
      "**/*.config.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: { version: "detect" }, // "detect" for Preact
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      import: importPlugin,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptPlugin.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/no-unresolved": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. React and its ecosystem
            ["^react$", "^react", "^react-dom", "^react-router-dom", "^preact"],
            // 2. Radix UI
            ["^@radix-ui/react-"],
            // 3. Other external libraries
            ["^@?w"],
            // 4. Project aliases
            ["^(@|@components|@lib|@pages|@api|@app)(/.*|$)"],
            // 5. Relative imports (parent, sibling, current)
            [
              "^\\.(?!/?$)",
              "^\\../?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
            ],
            // 6. Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
