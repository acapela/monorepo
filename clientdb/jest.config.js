const esModules = ["@sindresorhus/fnv1a"].join("|");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/(*.)+(spec|test).ts?(x)"],
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
};
