import { test } from "~e2e/helper/base-test";

import { AppDevPage } from "./helper/app-dev-page";

test("can close a topic", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  const appPage = new AppDevPage(page);

  await appPage.makeNewRequest({
    mentions: [["Request read", userName]],
  });

  await appPage.selectTopicOption("Close");

  await page.waitForSelector("text=closed the request");
});

test("can rename a topic", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  const originalTopicName = "Does swiss cheese have voting rights? Click here to find out!";
  const renamedTopicName = "TL;DR Not really, it's cheese.";

  const appPage = new AppDevPage(page);
  await appPage.makeNewRequest({
    mentions: [["Request read", userName]],
    title: originalTopicName,
  });

  await appPage.selectTopicOption("Rename");

  await page.waitForSelector("text=Submit");

  await page.fill('[data-test-id="prompt-input-rename"]', renamedTopicName);

  await page.click("text=Submit");

  await page.waitForSelector(`text=renamed ${originalTopicName} to ${renamedTopicName}`);
});

test("can archive topic", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  // Reduces opportunity for requests with same title;
  const requestTitle = "Unique as possible" + Math.random() * 1024;

  const appPage = new AppDevPage(page);
  await appPage.makeNewRequest({
    mentions: [["Request read", userName]],
    title: requestTitle,
  });

  await appPage.selectTopicOption("Archive");

  await page.waitForSelector(`text=archived the request`);
});
