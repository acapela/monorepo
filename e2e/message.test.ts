import { Page, expect } from "@playwright/test";

import { test } from "~e2e/helper/base-test";
import { basePath } from "~e2e/helper/constants";

async function createRequest(page: Page, mentionType: string, userName: string) {
  await page.goto(basePath);
  await page.click("text=New Request");
  await page.fill(`[placeholder="e.g. Feedback for new website copy"]`, "a new test request");
  await page.fill('[contenteditable="true"]', "What is happening @u");
  await page.click(`[role="option"]:has-text("${userName}")`);
  await page.click("text=" + mentionType);
  await page.click('button:has-text("Send request")');
}

test("create a new read request and update it to a response request", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;
  await createRequest(page, "Request read", userName);
  await page.waitForSelector("text=Read Confirmation");
  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(1);

  await page.hover(`p:has-text("@${userName}")`);
  await page.click("[aria-haspopup]");
  await page.click("text=Edit message");
  await page.click(`p >> text=@${userName}`);
  await page.click("text=Request response");
  await page.click("text=Save");

  await page.waitForSelector("text=Response");
  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(1);
});

test("create a new observer request", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  await createRequest(page, "Observer", db.user2.name);
  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(0);
});
