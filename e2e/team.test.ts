import { test } from "~e2e/helper/base-test";
import { basePath } from "~e2e/helper/constants";

test("create a team", async ({ page, auth, db }) => {
  await auth.login(db.user1);
  await page.goto(basePath);
  await page.click('button:has-text("Create new team")');
  await page.waitForNavigation();
  const teamName = "Team The Best Team" + Date.now();
  await page.keyboard.type(teamName);
  await page.click('button:has-text("Create new team")');
  // Skip slack
  await page.click('button:has-text("Skip this step")');
  // Dont invite anyone
  await page.click('button:has-text("Start using the app")');

  // Expect to be on homepage
  await page.waitForSelector(`text="New Request"`);
});
