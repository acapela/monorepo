import { test, expect } from "@playwright/test";
import { Database, setupDatabase } from "./helper/db";

const basePath = "http://localhost:3000";

let database: Database;

test.beforeAll(async () => {
  database = await setupDatabase();
  console.log("done");
});

test("find login button", async ({ page }) => {
  await page.goto(basePath);
  await page.click("text=Log in");
});

test("view spaces", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "next-auth.session-token",
      value: database.user2.JWT,
      domain: "localhost:3000",
      path: "/",
      sameSite: "Lax",
    },
  ]);
  await page.goto(basePath + "/spaces");
  const divText = await page.innerText("div");
  expect(divText.includes(database.space.name));
});

test.afterAll(async () => {
  if (!database.cleanup) return;
  console.log("cleanup");
  await database.cleanup();
  console.log("cleanup done.");
});
