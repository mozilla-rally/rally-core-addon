module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    webextensions: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/warnings",
  ],
  globals: {
    ChromeUtils: false,
    ExtensionAPI: false,
    // NOTE: These get injected via Rollup.
    __API_ENDPOINT__: false,
    __ION_STUDIES_LIST__: false,
    __ION_WEBSITE_URL__: false,
    __STORE_IMPLEMENTATION__: false,
  },
  overrides: [
    {
      files: "tests/**",
      env: {
        mocha: true,
      },
      extends: [
        "plugin:mocha/recommended",
      ],
    },
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: [
    "import",
    "mocha",
  ],
  root: true,
  rules: {
    "no-unused-vars": [ "error", { vars: "all", args: "none", ignoreRestSiblings: false } ],
    "no-var": "off", // TODO: "warn",
    "prefer-const": "off", // TODO: "warn",
  },
};
