import { get } from "lodash";
import { test as rootTest } from "@playwright/test";
import { domain } from "./constants";
import type { setupDatabase, TestUser } from "./db";

type Await<T> = T extends PromiseLike<infer U> ? U : T;

export const test = rootTest.extend<{
  db: Await<ReturnType<typeof setupDatabase>>["data"];
  auth: { login: (user: TestUser) => Promise<void> };
}>({
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
