import { test as rootTest } from "@playwright/test";
import { setupDatabase, TestUser } from "./db";

type Await<T> = T extends PromiseLike<infer U> ? U : T;

export const test = rootTest.extend<{
  db: Await<ReturnType<typeof setupDatabase>>["data"];
  auth: { login: (user: TestUser) => Promise<void> };
}>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async db({ page }, use) {
    const { data, cleanup } = await setupDatabase();
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
            domain: "localhost:3000",
            path: "/",
            sameSite: "Lax",
          },
        ]);
      },
    });
  },
});
