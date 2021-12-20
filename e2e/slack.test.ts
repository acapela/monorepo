import { Page } from "@playwright/test";

import { test } from "~e2e/helper/base-test";
import { basePath } from "~e2e/helper/constants";
import { routes } from "~shared/routes";

const testSlackEmail = process.env.TEST_SLACK_EMAIL as string;
const testSlackPassword = process.env.TEST_SLACK_PASSWORD as string;

/**
 * In CI we want to run all the tests, but locally you can opt-out if you don't have
 * testing credentials for Slack set.
 */
const shouldRunSuite = process.env.CI || (testSlackEmail && testSlackPassword);
const testFn = shouldRunSuite ? test : test.skip;

async function ensureSlackSession(page: Page) {
  await page.goto("https://alepaca.slack.com/");
  await page.waitForTimeout(200);
  await page.fill('[data-qa="login_email"]', testSlackEmail);
  await page.fill('[data-qa="login_password"]', testSlackPassword);
  await page.click('[data-qa="signin_button"]');
}

testFn("link team to Slack and create a request with the Slack slash command", async ({ auth, db, page }) => {
  await auth.login(db.user2);
  await ensureSlackSession(page);

  await page.goto(basePath + routes.settings);
  await page.click('button:has-text("Add Acapela to your Slack")');
  await page.click("text=Allow");
  await page.waitForSelector("text=Settings");

  await page.goto("https://alepaca.slack.com/");

  await page.click('[data-qa="message_input"]');
  const requestMessage = "test" + new Date().getTime();
  await page.keyboard.type("/" + process.env.SLACK_SLASH_COMMAND + " action " + requestMessage);
  await page.click('[aria-label="Send now"]');

  await page.waitForSelector(`[data-qa="message_content"]:has-text("Acapela"):has-text("${requestMessage}")`);
});
