import { test } from "./helper/base-test";
import { basePath } from "~end-to-end-tests/helper/constants";

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});

test("view spaces", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await page.goto(basePath + "/spaces");
  await page.waitForSelector(`text=${db.space.name}`);
});
