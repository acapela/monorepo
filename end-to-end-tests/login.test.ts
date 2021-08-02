import { test } from "@playwright/test";

const basePath = "http://localhost:3000";

test("find login", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});
