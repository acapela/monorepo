// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require("next/jest")()({
  collectCoverageFrom: ["**/*.{js,jsx,ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  setupFilesAfterEnv: ["<rootDir>/src/testSupport/setupTests.ts"],
  transform: {
    "^.+\\.css$": "<rootDir>/src/testSupport/cssTransform.ts",
  },
  moduleNameMapper: {
    "~frontend/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
})();
