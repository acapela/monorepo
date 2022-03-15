import { session } from "electron";

import { clearServiceCookiesBridge } from "@aca/desktop/bridge/auth";
import { appState } from "@aca/desktop/electron/appState";

import { initializeLoginHandler } from "./acapela";
import { initializeFigmaAuthHandler } from "./figma";
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

  clearServiceCookiesBridge.handle(async ({ url }) => {
    if (appState.mainWindow) {
      const cookieStore = session.defaultSession.cookies;
      const notionCookies = await cookieStore.get({ url });
      const cookieRemovalPromises = notionCookies.map((cookie) => cookieStore.remove(url, cookie.name));
      await Promise.all([...cookieRemovalPromises, session.defaultSession.clearStorageData({ origin: url })]);
    }
  });
}
