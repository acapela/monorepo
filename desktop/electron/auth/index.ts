import { session } from "electron";

import { clearServiceCookiesBridge } from "@aca/desktop/bridge/auth";

import { initializeLoginHandler } from "./acapela";
import { initializeFigmaAuthHandler } from "./figma";
import { initializeGitHubAuthHandler } from "./github";
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
  initializeLinearAuthHandler();
  initializeJiraAuthHandler();
  initializeGitHubAuthHandler();

  clearServiceCookiesBridge.handle(async ({ url }) => {
    const cookieStore = session.defaultSession.cookies;
    const serviceCookies = await cookieStore.get({ url });
    const cookieRemovalPromises = serviceCookies.map((cookie) => cookieStore.remove(url, cookie.name));
    session.defaultSession.clearStorageData({ origin: url, storages: ["localstorage"] });
    await Promise.all([...cookieRemovalPromises, session.defaultSession.clearStorageData({ origin: url })]);
  });
}
