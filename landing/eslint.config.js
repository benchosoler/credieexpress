import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import astroParser from "astro-eslint-parser"; // Necesitas este parser

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser, // Parser base para archivos Astro
      parserOptions: {
        parser: tseslint.parser, // Parser para el TS dentro de <script> y frontmatter
        extraFileExtensions: [".astro"],
        sourceType: "module",
      },
    },
    rules: {
      "astro/no-set-html-directive": "error",
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/", ".vscode/"],
  },
];
