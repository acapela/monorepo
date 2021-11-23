import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 5, // We have some flakiness wrt topic creation
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
};
export default config;
