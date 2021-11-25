import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 5, // We have some flakiness wrt topic creation
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  forbidOnly: Boolean(process.env.CI) && process.env.CI !== "false",
};
export default config;
