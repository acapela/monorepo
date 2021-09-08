import { test } from "./helper/base-test";
import { createAndGotoTopic } from "./helper/common-actions";

test("create a topic", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createAndGotoTopic(page, { spaceName: db.space.name, roomName: "Moor", topicName: "hot takes" });
});

test("close a topic", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createAndGotoTopic(page, { spaceName: db.space.name, roomName: "Revolving Room", topicName: "here and gone" });
  await page.click("text=Close Topic");
  await page.click("text=Close without summary");
  await page.waitForSelector("text=Topic was closed");
});

test("delete a topic", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  const topicName = "not for long";
  await createAndGotoTopic(page, { spaceName: db.space.name, roomName: "DoomRoom", topicName });

  await page.click("button:right-of(:text('Close Topic'))");
  await page.click("text=Delete topic");
  await page.click("text='Delete'");
  await page.waitForSelector(`text='${topicName}'`, { state: "hidden" });
});
