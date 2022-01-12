import { Page, expect } from "@playwright/test";

import { getInviteURL } from "@aca/backend/src/inviteUser/utils";
import { test } from "@aca/e2e/helper/base-test";
import { basePath } from "@aca/e2e/helper/constants";
import { routes } from "@aca/shared/routes";

async function createTeam(page: Page, teamName: string) {
  await page.goto(basePath + routes.teamSelect);
  await page.click('button:has-text("Create new team")');
  await page.waitForNavigation();
  await page.keyboard.type(teamName);
  await page.click('button:has-text("Create new team")');
  // Skip slack
  await page.click('button:has-text("Skip this step")');
  // Dont invite anyone
  await page.click('button:has-text("Start using the app")');

  // Expect to be on homepage
  await page.waitForSelector(`text="New Request"`);
}

test("create a team", async ({ page, auth, db }) => {
  await auth.login(db.user1);
  await createTeam(page, "Team The Best Team" + Date.now());
});

async function inviteUser(page: Page, email: string) {
  await page.goto(basePath + routes.settings);
  await page.fill('[name="invite-email"]', email);
  await page.click('text="Send invite"');
  return page.waitForSelector(`text=${email}(Invite pending)`);
}

test("invite a new user", async ({ page, auth, db, browser }) => {
  await auth.login(db.user2);

  const element = await inviteUser(page, `${db.prefix}greenhorn@acape.la`);
  const invitedUserId = await element.getAttribute("data-test-user-id");
  expect(typeof invitedUserId).toBe("string");

  // In the real world, this is where an invite would be received through E-Mail or Slack. Since we do not mock this yet
  // we generate an invite URL ourselves

  const newBrowserContext = await browser.newContext();
  const newPage = await newBrowserContext.newPage();
  await newPage.goto(getInviteURL(invitedUserId!));
  await newPage.waitForSelector("text=You have been invited");
  await newBrowserContext.close();
});

test("invite an existing user", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  await createTeam(page, "Just the Two of Us" + Date.now());
  await inviteUser(page, db.user1.email);
});

test("remove team member", async ({ page, auth, db }) => {
  await auth.login(db.user1);
  await page.goto(basePath);
  await page.click("text=Select team");

  await page.goto(basePath + routes.settings);
  await expect(page.locator(`text=${db.user2.name}`)).toHaveCount(1);

  await page.click(`button[title^="Remove ${db.user2.name}"]`);
  await expect(page.locator(`text=${db.user2.name}`)).toHaveCount(0);
});
