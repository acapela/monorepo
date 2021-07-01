module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/(*.)+(spec|test).ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/testSupport/setupTests.ts"],
};
