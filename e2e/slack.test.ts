import { Page, chromium } from "@playwright/test";

import { test } from "@aca/e2e/helper/base-test";
import { basePath } from "@aca/e2e/helper/constants";
import { setupDatabase } from "@aca/e2e/helper/db";
import { addSessionCookie } from "@aca/e2e/helper/utils";
import { routes } from "@aca/shared/routes";

const SLACK_URL = "https://alepaca.slack.com/";

const testSlackEmail = process.env.TEST_SLACK_EMAIL as string;
const testSlackPassword = process.env.TEST_SLACK_PASSWORD as string;
const { SLACK_SLASH_COMMAND: SLASH_COMMAND } = process.env;

/**
 * In CI we want to run all the tests, but locally you can opt-out if you don't have
 * testing credentials for Slack set.
 */
const shouldRunSuite = process.env.CI || (testSlackEmail && testSlackPassword);
const testFn = shouldRunSuite ? test : test.skip;

/**
 * We want all tests to start with a running Slack session which is already connected to
 * an Acapela team. This here achieves it by re-using the same page, which does also require
 * all tests to be run serially.
 */
let page: Page;
let cleanupDb: () => Promise<void>;
test.beforeAll(async () => {
  page = await (await chromium.launch()).newPage();
  const { data, cleanup } = await setupDatabase("slack_");
  cleanupDb = cleanup;
  await addSessionCookie(page, data.user2.jwt);

  // login to Slack
  await page.goto(SLACK_URL);
  // slack's login form needs a moment
  await page.waitForTimeout(200);
  await page.fill('[data-qa="login_email"]', testSlackEmail);
  await page.fill('[data-qa="login_password"]', testSlackPassword);
  await page.click('[data-qa="signin_button"]');

  // add Slack integration for current team
  await page.goto(basePath + routes.settings);
  await page.click('button:has-text("Add Acapela to your Slack")');
  await page.click("text=Allow");
  await page.waitForSelector("text=Settings");
});

test.afterAll(async () => {
  await cleanupDb();
});

const generateTestMessage = () => "test" + new Date().getTime();

testFn("create a quick request from slash command", async () => {
  await page.goto(SLACK_URL);
  await page.click('[data-qa="message_input"]');
  const message = generateTestMessage();
  await page.keyboard.type(`/${SLASH_COMMAND} action ${message}`);
  await page.click('[aria-label="Send now"]');

  await page.waitForSelector(`[data-qa="message_content"]:has-text("Acapela"):has-text("${message}")`);
});

testFn("create a self request from slash command with modal", async () => {
  await page.goto(SLACK_URL);
  await page.click('[data-qa="message_input"]');
  const message = generateTestMessage();
  await page.keyboard.type(`/${SLASH_COMMAND} ${message} `);
  await page.waitForTimeout(100);
  await page.keyboard.type("@");
  await page.click("text=(you)");
  await page.click('[aria-label="Send now"]');

  await page.fill('[name="topic_name"]', message);
  await page.click('[data-qa="wizard_modal_next"]');

  await page.waitForSelector(`[data-qa="message_content"]:has-text("Acapela"):has-text("${message}")`);
});

testFn("create self request through message action", async () => {
  await page.goto(SLACK_URL);
  await page.click('[data-qa="message_input"]');
  const message = generateTestMessage();
  await page.keyboard.type(message);
  await page.click('[aria-label="Send now"]');

  await page.hover(`[data-qa="message_content"]:has-text("${message}")`);
  await page.click('[data-qa="more_message_actions"]');
  await page.click("text=Create a personal");
  await page.waitForSelector(`[data-qa="message_content"]:has-text("Acapela"):has-text("${message}")`);
});
