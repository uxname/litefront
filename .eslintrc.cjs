module.exports = {
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    "storybook-build/*",
    "dist/*",
    "src/generated/*",
    "src/vite-env.d.ts",
    "src/routeTree.gen.ts",
  ],
  env: { browser: true, es2021: true, node: true },
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: "module",
    project: undefined,
  },
  settings: { react: { version: "detect" } },
  plugins: [
    "react-refresh",
    "sonarjs",
    "unicorn",
    "comments",
    "promise",
    "security",
    "no-secrets",
    "react",
    "eslint-plugin-import",
    "simple-import-sort",
    "@typescript-eslint/eslint-plugin",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "@jetbrains",
    "@jetbrains/eslint-config/node",
    "plugin:sonarjs/recommended",
    "plugin:security/recommended-legacy",
    "plugin:eslint-comments/recommended",
    "plugin:promise/recommended",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-namespace": "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Packages `react` related packages come first.
          ["^react", "^next", String.raw`^@?\w`],
          // Internal packages.
          ["^(@|components)(/.*|$)"],
          // Side effect imports.
          [String.raw`^\u0000`],
          // Parent imports. Put `..` last.
          [String.raw`^\.\.(?!/?$)`, String.raw`^\.\./?$`],
          // Other relative imports. Put same-folder imports and `.` last.
          [
            String.raw`^\./(?=.*/)(?!/?$)`,
            String.raw`^\.(?!/?$)`,
            String.raw`^\./?$`,
          ],
          // Style imports.
          [String.raw`^.+\.?(styles)$`],
        ],
      },
    ],
    "linebreak-style": "off",
    "max-len": "off",
    "no-return-assign": "off",
    "valid-jsdoc": "off",
    radix: "off",
    "no-native-reassign": "off",
    "multiline-ternary": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "no-multiple-empty-lines": "error",
    "no-use-before-define": "off",
    "react/prop-types": "off",
    "no-catch-shadow": "off",
    "no-nested-ternary": "off",
    "prefer-template": "error",
    "prefer-spread": "error",
    "prefer-arrow-callback": "error",
    "no-var": "error",
    "arrow-spacing": "error",
    complexity: ["error", { max: 15 }],
    "unicorn/filename-case": "off",
    "@typescript-eslint/explicit-function-return-type": "error",

    "max-lines": [
      "error",
      { max: 1000, skipBlankLines: true, skipComments: true },
    ],
    "max-params": ["error", { max: 5 }],
    "max-nested-callbacks": ["error", { max: 3 }],
    "max-depth": ["error", { max: 4 }],
    "no-magic-numbers": ["warn", { ignore: [0, 1, -1, 2] }],
    "unicorn/consistent-function-scoping": [
      "error",
      { checkArrowFunctions: true },
    ],
    "unicorn/prevent-abbreviations": [
      "error",
      { checkDefaultAndNamespaceImports: true },
    ],

    "unicorn/empty-brace-spaces": "error",
    "unicorn/no-unreadable-array-destructuring": "error",
  },
};
