import { test as rootTest } from "@playwright/test";

import { domain } from "./constants";
import { TestUser, setupDatabase } from "./db";
import { isSentryStoreURL } from "./utils";

type Await<T> = T extends PromiseLike<infer U> ? U : T;

export const test = rootTest.extend<{
  db: Await<ReturnType<typeof setupDatabase>>["data"];
  auth: { login: (user: TestUser) => Promise<void> };
}>({
  async page({ page }, use) {
    await page.route(
      (url) => isSentryStoreURL(url),
      (route) => route.abort()
    );
    await use(page);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async db({ page, context }, use, testInfo) {
    const { data, cleanup } = await setupDatabase(String(testInfo.workerIndex));
    await use(data);
    await cleanup();
  },
  async auth({ page }, use) {
    await use({
      async login(user) {
        await page.context().addCookies([
          {
            name: "next-auth.session-token",
            value: user.jwt,
            domain,
            path: "/",
            sameSite: "Lax",
          },
        ]);
      },
    });
  },
});
