import { test } from "./helper/base-test";
import { basePath } from "./helper/constants";

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});
