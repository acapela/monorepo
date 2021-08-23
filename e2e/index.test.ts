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

function whenFocusInContentEditable() {
  return new Promise<void>((resolve) => {
    const handleFocusIn = ({ target }: FocusEvent) => {
      if (target instanceof HTMLElement && target.contentEditable) {
        document.removeEventListener("focusin", handleFocusIn);
        resolve();
      }
    };
    document.addEventListener("focusin", handleFocusIn);
  });
}

async function createTopic(page: Page, { topicName, ...roomProps }: { topicName: string } & RoomProps) {
  await createAndNavigateToRoom(page, roomProps);
  await page.click("text=New Topic");
  await page.waitForFunction(whenFocusInContentEditable);

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

test("send a message", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await createTopic(page, { spaceName: db.space.name, roomName: "Mailbox", topicName: "hot takes" });
  await page.click('[class^="RichEditor__UIEditorContent"]');
  const message = "What is happening";
  await page.keyboard.type(message);
  await page.keyboard.press("Enter");
  await page.waitForSelector("text=" + message);
});
