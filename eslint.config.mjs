import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      reactHooks,
    },
    rules: {
      eqeqeq: "off",
      "react-hooks/exhaustive-deps": "off",
      "no-useless-escape": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
