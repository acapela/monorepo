import { BrowserWindow, session } from "electron";

import { loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";

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
  const currentToken = await getNotionAuthToken();
  if (currentToken) {
    notionAuthTokenBridgeValue.set(currentToken);
    console.info("Already logged in");
    return;
  }

  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(notionURL + "/login");

  window.webContents.on("did-navigate-in-page", async () => {
    const token = await getNotionAuthToken();

    if (!token) {
      return;
    }

    window.close();

    notionAuthTokenBridgeValue.set(token);
  });
}

export function initializeNotionAuthHandler() {
  loginNotionBridge.handle(async () => {
    await loginNotion();
  });

  getNotionAuthToken().then((token) => {
    notionAuthTokenBridgeValue.set(token);
  });
}
