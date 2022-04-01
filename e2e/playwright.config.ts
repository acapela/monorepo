import { PlaywrightTestConfig } from "@playwright/test";

import { IS_CI } from "@aca/shared/dev";

const config: PlaywrightTestConfig = {
  retries: IS_CI ? 2 : 0, // We still have some flakiness, but hopefully this number will go to 0 at some point.
  use: {
    // To reduce artifact size in CI we set the size to 720p which should be enough
    video: IS_CI ? { mode: "retain-on-failure", size: { width: 1280, height: 720 } } : "retain-on-failure",
    trace: "retain-on-failure",
  },
  forbidOnly: IS_CI,
  globalSetup: require.resolve("./global-setup.ts"),
};
export default config;
