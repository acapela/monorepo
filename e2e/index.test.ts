import { test } from "./helper/base-test";
import { basePath } from "./helper/constants";

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});

const COMPOSER_SELECTOR = '[class^="RichEditor__UIEditorContent"]';

test("it should not allow sending the first message without a mention", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await page.goto(basePath);
  await page.click("text=New Topic");

  await page.click(COMPOSER_SELECTOR);
  const message = "What is happening";
  await page.keyboard.type(message);
  await page.keyboard.press("Enter");
  await page.waitForSelector("text=The first message should have a mention.");
});

test("replying to a request-response marks it as done", async ({ page, db, auth }) => {
  await auth.login(db.user2);
  await page.goto(basePath);
  await page.click("text=New Topic");

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
  await page.goto(basePath);
  await page.click("text=New Topic");

  await page.click(COMPOSER_SELECTOR);
  await page.keyboard.type("What is happening @u");
  await page.click(`text='${db.user1.name}'`);
  await page.click("text=Request read receipt");

  await page.click(COMPOSER_SELECTOR);

  await page.keyboard.type("and now @u");
  await page.click(`text='${db.user1.name}'`);
  await page.click("text=Request response");

  await page.click(COMPOSER_SELECTOR);

  await page.keyboard.press("Enter");

  await page.waitForSelector(`text=Response from`);
});
