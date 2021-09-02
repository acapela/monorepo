import { Page, expect } from "@playwright/test";

import { basePath } from "~e2e/helper/constants";
import { wait } from "~shared/time";

import { test } from "./helper/base-test";

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});

test("view spaces", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await page.goto(basePath + "/spaces");
  await page.waitForSelector(`text=${db.space.name}`);
});

type RoomProps = { spaceName: string; roomName: string };
async function createAndNavigateToRoom(page: Page, { spaceName, roomName }: RoomProps) {
  await page.goto(basePath);
  await page.click("text='New Room'");
  await page.click("text=Room name", { force: true });
  await page.keyboard.type(roomName);
  await page.click("text='Space'", { force: true });
  await page.click(`[role="option"]:has-text("${spaceName}")`);
  await page.click("text='Create'");

  await page.waitForNavigation({ url: (url) => url.pathname.startsWith("/space") });
  await page.waitForSelector(`text='${roomName}'`);
}

test("create a room", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createAndNavigateToRoom(page, { spaceName: db.space.name, roomName: "Roomba" });
});

async function createTopic(page: Page, { topicName, ...roomProps }: { topicName: string } & RoomProps) {
  await createAndNavigateToRoom(page, roomProps);
  await page.click("text=New Topic");
  await page.waitForFunction(
    () => document.activeElement instanceof HTMLElement && document.activeElement.contentEditable
  );

  // playwright can be faster in picking up focus than our app in handling keystrokes, so we wait
  await wait(1000);
  await page.keyboard.type(topicName);
  await page.keyboard.press("Enter");

  await page.waitForSelector(`h3:text("${topicName}")`);
  expect((await page.$$(`text='${topicName}'`)).length).toBe(2);
  // should only find the new topic button, not a topic with that name, as we just renamed it
  expect((await page.$$("text=New Topic")).length).toBe(1);
}

test("create a topic", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createTopic(page, { spaceName: db.space.name, roomName: "Moor", topicName: "hot takes" });
});

test("delete a topic", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  const topicName = "not for long";
  await createTopic(page, { spaceName: db.space.name, roomName: "DoomRoom", topicName });

  await page.click("button:right-of(:text('Close Topic'))");
  await page.click("text=Delete topic");
  await page.click("text='Delete'");
  await page.waitForSelector(`text='${topicName}'`, { state: "hidden" });
});

const COMPOSER_SELECTOR = '[class^="RichEditor__UIEditorContent"]';

test("send a message", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createTopic(page, { spaceName: db.space.name, roomName: "Mailbox", topicName: "hot takes" });
  await page.click(COMPOSER_SELECTOR);
  const message = "What is happening";
  await page.keyboard.type(message);
  await page.keyboard.press("Enter");
  await page.waitForSelector("text=" + message);
});

test("replying to a request-response marks it as done", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createTopic(page, { spaceName: db.space.name, roomName: "ResponsiveRoom", topicName: "cold takes" });

  await page.click(COMPOSER_SELECTOR);
  await page.keyboard.type("What is happening @u");
  await page.click(`[role="option"]:has-text("${db.user2.name}")`);
  await page.click("text=Request response");
  await page.click(COMPOSER_SELECTOR);
  await page.keyboard.press("Enter");

  await page.waitForSelector(`text=Response from`);

  await page.click(COMPOSER_SELECTOR);
  await page.keyboard.type("Not much");
  await page.keyboard.press("Enter");

  await page.waitForSelector("[data-test-task-is-done]");
});

test("sending a message with tasks for read and response, asks for the latter", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createTopic(page, { spaceName: db.space.name, roomName: "Mailbox", topicName: "hot takes" });
  await page.click(COMPOSER_SELECTOR);

  await page.keyboard.type("What is happening @u");
  await page.click(`text='${db.user1.name}'`);
  await page.click("text=Notify only");

  await page.click(COMPOSER_SELECTOR);

  await page.keyboard.type("and now @u");
  await page.click(`text='${db.user1.name}'`);
  await page.click("text=Request response");

  await page.click(COMPOSER_SELECTOR);

  await page.keyboard.press("Enter");

  await page.waitForSelector(`text=Response from`);
});
