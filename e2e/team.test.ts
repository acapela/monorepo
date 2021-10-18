import { test } from "~e2e/helper/base-test";
import { basePath } from "~e2e/helper/constants";

test("create a team", async ({ page, auth, db }) => {
  await auth.login(db.user1);
  await page.goto(basePath);
  await page.click("text=Create new team");
  const teamName = "Team The Best Team" + Date.now();
  await page.keyboard.type(teamName);
  await page.click('[role="dialog"] button:has-text("Create new team")');
  await page.waitForSelector(`text="${teamName} Team"`);
});
