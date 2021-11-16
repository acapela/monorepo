import { Page } from "playwright-core";

import { test } from "~e2e/helper/base-test";

import { basePath } from "./helper/constants";

// TODO: move elsewhere
async function createRequest(page: Page, mentionType: string, userName: string, requestName?: string) {
  await page.goto(basePath);
  await page.click("text=New Request");
  await page.fill(`[placeholder="e.g. Feedback for new website copy"]`, requestName ?? requestTopicName);
  await page.fill('[contenteditable="true"]', "What is happening @u");
  await page.click(`[role="option"]:has-text("${userName}")`);
  await page.click("text=" + mentionType);
  await page.click('button:has-text("Send request")');
}

test("can close a topic", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  await createRequest(page, "Request read", userName);
  await page.waitForSelector("text=Read Confirmation");

  await page.click('[data-test-id="topic-options"]');

  await page.click("text=Close");

  await page.waitForSelector("text=closed the request");
});

test("can rename a topic", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  const originalTopicName = "Does swiss cheese have voting rights? Click here to find out!";
  const renamedTopicName = "TL;DR Not really, it's cheese.";
  await createRequest(page, "Request read", userName, originalTopicName);
  await page.waitForSelector("text=Read Confirmation");

  await page.click('[data-test-id="topic-options"]');

  await page.click("text=Rename");

  await page.waitForSelector("text=Submit");

  await page.fill('[data-test-id="prompt-input-rename"]', renamedTopicName);

  await page.click("text=Submit");

  await page.waitForSelector(`text=renamed ${originalTopicName} to ${renamedTopicName}`);
});
