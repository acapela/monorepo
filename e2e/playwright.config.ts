import { PlaywrightTestConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI) && process.env.CI !== "false";
const config: PlaywrightTestConfig = {
  retries: isCI ? 2 : 0, // We still have some flakiness, but hopefully this number will go to 0 at some point.
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  forbidOnly: isCI,
};
export default config;
