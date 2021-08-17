import { basePath } from "~e2e/helper/constants";

import { test } from "./helper/base-test";

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});

test("view spaces", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await page.goto(basePath + "/spaces");
  await page.waitForSelector(`text=${db.space.name}`);
});

test("create a room", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await page.goto(basePath);

  await page.click("text=New Room");
  await page.click("text=Room name", { force: true });
  await page.keyboard.type("Roomba");
  await page.click("text='Space'", { force: true });
  await page.click("text=" + db.space.name);
  await page.click("text='Create'");

  await page.waitForNavigation({ url: (url) => url.pathname.startsWith("/space") });
  await page.waitForSelector("text=Roomba");
});
