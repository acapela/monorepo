import { expect } from "@playwright/test";

import { test } from "~e2e/helper/base-test";
import { getUUID } from "~shared/uuid";

import { AppDevPage } from "./helper/app-dev-page";

test("create a new read request and update it to a response request", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  const appPage = new AppDevPage(page);

  await appPage.makeNewRequest({
    mentions: [["Request read", userName]],
  });

  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(1);

  await page.hover(`p:has-text("@${userName}")`);
  await page.click('[data-test-id="message-options"]');
  await page.click("text=Edit message");
  await page.click(`p >> text=@${userName}`);
  await page.click("text=Request response");
  await page.click("text=Save");

  await page.waitForSelector("text=Response");
  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(1);
});

test("create a new observer request", async ({ page, auth, db }) => {
  await auth.login(db.user2);

  const appPage = new AppDevPage(page);
  await appPage.makeNewRequest({
    mentions: [["Observer", db.user2.name]],
  });

  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(0);
});

test("mark own request as read", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const mentionedUser = db.user2.name;
  const requestName = "User 2 completes own task" + getUUID();

  const appPage = new AppDevPage(page);
  await appPage.makeNewRequest({
    mentions: [["Request read", mentionedUser]],
    title: requestName,
  });

  expect(await page.$$("[data-test-message-tasks]")).toHaveLength(1);

  await appPage.waitForRequestInGroup(requestName, "Received");

  await page.click('button:has-text("Mark as read")');

  await page.waitForSelector(`[data-test-task-assignee="${db.user2.id}"]:has-text("✓")`);

  await appPage.waitForRequestInGroup(requestName, "Sent");
});
