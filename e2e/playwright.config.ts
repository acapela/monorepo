import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 5, // We have some flakiness wrt topic creation
  globalSetup: require.resolve("./helper/global-setup"),
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
};
export default config;
