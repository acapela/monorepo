module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/(*.)+(spec|test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/testSupport/setupTests.ts'],
};
