import { expect } from "@playwright/test";

import { getInviteURL } from "~backend/src/inviteUser/utils";
import { test } from "~e2e/helper/base-test";
import { basePath } from "~e2e/helper/constants";
import { routes } from "~shared/routes";

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

test("invite a new user", async ({ page, auth, db, browser }) => {
  await auth.login(db.user2);
  await page.goto(basePath + routes.settings);
  const newUserEmail = "__TESTING__greenhorn@acape.la";
  await page.fill('[name="invite-email"]', newUserEmail);
  await page.click('text="Send invite"');
  const element = await page.waitForSelector(`text=${newUserEmail}(Invite pending)`);
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
