import { BrowserWindow, session } from "electron";

import { clearServiceCookiesBridge, openBrowserWindow } from "@aca/desktop/bridge/auth";
import { appState } from "@aca/desktop/electron/appState";
import { authWindowDefaultOptions } from "@aca/desktop/electron/auth/utils";

import { initializeLoginHandler } from "./acapela";
import { initializeFigmaAuthHandler } from "./figma";
import { initializeGoogleAuthHandler } from "./google";
import { initializeLinearAuthHandler } from "./linear";
import { initializeNotionAuthHandler } from "./notion";

export function initializeAuthHandlers() {
  initializeLoginHandler();
  initializeNotionAuthHandler();
  initializeGoogleAuthHandler();
  initializeFigmaAuthHandler();
  initializeLinearAuthHandler();

  openBrowserWindow.handle(async ({ url }) => {
    const window = new BrowserWindow({ ...authWindowDefaultOptions });
    await window.webContents.loadURL(url);
    return () => {
      window.destroy();
    };
  });

  clearServiceCookiesBridge.handle(async ({ url }) => {
    if (appState.mainWindow) {
      const cookieStore = session.defaultSession.cookies;
      const notionCookies = await cookieStore.get({ url });
      const cookieRemovalPromises = notionCookies.map((cookie) => cookieStore.remove(url, cookie.name));
      await Promise.all([...cookieRemovalPromises, session.defaultSession.clearStorageData({ origin: url })]);
    }
  });
}
