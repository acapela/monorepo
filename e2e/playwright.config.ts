import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve("./helper/global-setup"),
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
};
export default config;
