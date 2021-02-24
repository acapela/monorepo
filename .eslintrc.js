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
};
