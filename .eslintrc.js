module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  overrides: [
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
      },
    },
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "no-console": ["warn", { allow: ["warn", "error", "info", "trace"] }],
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/ban-ts-comment": ["warn", { "ts-expect-error": false }],
  },
};
