import { BrowserWindow, session } from "electron";

import { notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { clearServiceCookiesBridge, loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { tryInitializeServiceSync } from "@aca/desktop/electron/apps";
import { updateAvailableSpaces } from "@aca/desktop/electron/apps/notion/worker";

import { authWindowDefaultOptions } from "./utils";

export const notionDomain = "www.notion.so";
export const notionURL = `https://${notionDomain}`;

export async function getNotionAuthToken() {
  const cookies = await session.defaultSession.cookies.get({ url: notionURL });

  const userIdCookie = cookies.find((cookie) => cookie.name === "notion_user_id");
  const tokenCookie = cookies.find((cookie) => cookie.name === "token_v2");

  if (!userIdCookie || !tokenCookie) return null;

  return tokenCookie.value;
}

export async function loginNotion() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(notionURL + "/login");

  /*
    This is done as some previous actions that trigger a figma login may steal focus
    I believe the right fix for this is have the login screens as modals, but this would require
    managing closing the modals https://github.com/electron/electron/issues/30232
  */
  window.webContents.on("did-finish-load", () => {
    window.focus();
  });

  return new Promise<void>((resolve) => {
    window.webContents.on("did-navigate-in-page", async () => {
      const token = await getNotionAuthToken();

      if (!token) {
        return;
      }

      window.close();

      notionAuthTokenBridgeValue.set(token);
      resolve();
    });
  });
}

export function initializeNotionAuthHandler() {
  loginNotionBridge.handle(async () => {
    await loginNotion();
    await updateAvailableSpaces();
    tryInitializeServiceSync("notion");
  });

  getNotionAuthToken().then((token) => {
    notionAuthTokenBridgeValue.set(token);
  });
}

export function clearNotionSessionData() {
  notionAuthTokenBridgeValue.reset();
  notionSelectedSpaceValue.reset();
  clearServiceCookiesBridge({ url: notionURL });
}
