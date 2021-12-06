import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 1, // We still have some flakiness, but hopefully this number will go to 0 at some point.
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  forbidOnly: Boolean(process.env.CI) && process.env.CI !== "false",
};
export default config;
