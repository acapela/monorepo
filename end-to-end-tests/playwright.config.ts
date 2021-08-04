import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve("./helper/global-setup"),
  use: {
    screenshot: "only-on-failure",
  },
};
export default config;
