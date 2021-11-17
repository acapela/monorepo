import { expect } from "@playwright/test";

import { AppDevPage } from "./helper/app-dev-page";
import { test } from "./helper/base-test";
import { basePath } from "./helper/constants";

test("reports to sentry", async ({ page, auth, db }) => {
  await auth.login(db.user2);
  await page.goto(basePath);

  const title = "Search for me";

  const appPage = new AppDevPage(page);

  await appPage.makeNewRequest({
    mentions: [["Request read", db.user1.name]],
    title,
  });

  await appPage.writeInSearchBox("Something else that does not exist");

  await expect(await appPage.getSidebarRequestGroups()).not.toContainText(title);

  await appPage.writeInSearchBox("Search for");
  await expect(await appPage.getSidebarRequestGroups()).toContainText(title);

  await appPage.writeInSearchBox("for me");
  await expect(await appPage.getSidebarRequestGroups()).toContainText(title);

  await appPage.writeInSearchBox("again something wrong");
  await expect(await appPage.getSidebarRequestGroups()).not.toContainText(title);
});
