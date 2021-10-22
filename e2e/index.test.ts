import { test } from "./helper/base-test";
import { basePath } from "./helper/constants";
import { isSentryStoreURL } from "./helper/utils";

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});

test("reports to sentry", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  await page.goto(basePath + "/obscure-error-test-page");
  await page.click("button");
  await page.waitForRequest((req) => isSentryStoreURL(new URL(req.url())));
});
