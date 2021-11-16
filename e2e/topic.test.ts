import { test } from "~e2e/helper/base-test";

import { createRequest } from "./message.test";

test.only("can close a topic", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  const userName = db.user2.name;

  await createRequest(page, "Request read", userName);
  await page.waitForSelector("text=Read Confirmation");

  await page.click('[data-test-id="topic-options"]');

  await page.click("text=Close");

  await page.waitForSelector("text=closed the request");
});
