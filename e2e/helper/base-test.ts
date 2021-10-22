import { Page, test as rootTest } from "@playwright/test";
import { get } from "lodash";

import { domain } from "./constants";
import type { TestUser, setupDatabase } from "./db";
import { createNetworkListener, isSentryStoreURL } from "./utils";

type Await<T> = T extends PromiseLike<infer U> ? U : T;

const wrapPageKeys = <K extends keyof Page>(keys: K[]) => keys;
const INTERCEPT_PAGE_KEYS = wrapPageKeys(["click", "fill", "waitForSelector"]);

export const test = rootTest.extend<{
  db: Await<ReturnType<typeof setupDatabase>>["data"];
  auth: { login: (user: TestUser) => Promise<void> };
}>({
  async page({ page }, use) {
    await page.route(
      (url) => isSentryStoreURL(url),
      (route) => route.abort()
    );

    const networkListener = await createNetworkListener(page);

    await use(
      new Proxy(page, {
        get(target, key, receiver) {
          if (INTERCEPT_PAGE_KEYS.includes(key as never)) {
            const typedKey = key as typeof INTERCEPT_PAGE_KEYS[number];
            const fn = target[typedKey];
            return async (...args: Parameters<typeof fn>) => {
              await networkListener.waitForIdle();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (fn as any).apply(receiver, args);
            };
          }
          return (target as never)[key];
        },
      })
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async db({ page }, use) {
    await use(JSON.parse(get(process.env, "TESTING_DB_DATA", "null")));
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
