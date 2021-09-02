import { Page, expect } from "@playwright/test";

import { wait } from "~shared/time";

import { basePath } from "./constants";

type RoomProps = { spaceName: string; roomName: string };

export async function createAndGotoRoom(page: Page, { spaceName, roomName }: RoomProps) {
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

export async function createAndGotoTopic(page: Page, { topicName, ...roomProps }: { topicName: string } & RoomProps) {
  await createAndGotoRoom(page, roomProps);
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
