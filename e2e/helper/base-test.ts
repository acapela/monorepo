import { test as rootTest } from "@playwright/test";

import { isSentryStoreURL } from "./utils";

export const test = rootTest.extend<{}>({
  async page({ page }, use) {
    await page.route(
      (url) => isSentryStoreURL(url),
      (route) => route.abort()
    );
    await use(page);
  },
});
