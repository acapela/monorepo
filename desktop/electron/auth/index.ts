import { session } from "electron";

import { clearServiceCookiesBridge } from "@aca/desktop/bridge/auth";

import { initializeLoginHandler } from "./acapela";
import { initializeAsanaAuthHandler } from "./asana";
import { initializeClickUpAuthHandler } from "./clickup";
import { initializeFigmaAuthHandler } from "./figma";
import { initializeGitHubAuthHandler } from "./github";
import { initializeGmailAuthHandler } from "./gmail";
import { initializeGoogleAuthHandler } from "./google";
import { initializeJiraAuthHandler } from "./jira";
import { initializeLinearAuthHandler } from "./linear";
import { initializeNotionAuthHandler } from "./notion";
import { initializeSlackAuthHandler } from "./slack";

export function initializeAuthHandlers() {
  initializeLoginHandler();
  initializeNotionAuthHandler();
  initializeGoogleAuthHandler();
  initializeSlackAuthHandler();
  initializeFigmaAuthHandler();
  initializeGmailAuthHandler();
  initializeLinearAuthHandler();
  initializeJiraAuthHandler();
  initializeGitHubAuthHandler();
  initializeAsanaAuthHandler();
  initializeClickUpAuthHandler();

  clearServiceCookiesBridge.handle(async ({ url }) => {
    console.trace(url);
    const cookieStore = session.defaultSession.cookies;
    const serviceCookies = await cookieStore.get({ url });
    const cookieRemovalPromises = serviceCookies.map((cookie) => cookieStore.remove(url, cookie.name));
    session.defaultSession.clearStorageData({ origin: url, storages: ["localstorage"] });
    await Promise.all([...cookieRemovalPromises, session.defaultSession.clearStorageData({ origin: url })]);
  });
}
