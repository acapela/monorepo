import { BrowserWindow, session } from "electron";

import { loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { tryInitializeServiceSync } from "../apps";
import { authWindowDefaultOptions } from "./utils";

const notionURL = "https://www.notion.so";

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
    tryInitializeServiceSync("notion");
  });

  getNotionAuthToken().then((token) => {
    notionAuthTokenBridgeValue.set(token);
  });
}
