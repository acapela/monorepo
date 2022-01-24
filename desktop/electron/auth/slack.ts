import { BrowserWindow, session } from "electron";

import { loginSlackBridge, slackAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";

import { authWindowDefaultOptions } from "./utils";

const slackURL = "https://www.slack.com";

export async function getSlackAuthToken() {
  const [authCookie] = await session.defaultSession.cookies.get({ url: slackURL, name: "oi" });

  if (!authCookie) return null;

  return authCookie.value;
}

export async function loginSlack() {
  const currentToken = await getSlackAuthToken();
  if (currentToken) {
    slackAuthTokenBridgeValue.set(currentToken);
    console.info("Already logged in");
    return;
  }

  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL("https://slack.com/ssb/signin");

  window.webContents.on("did-navigate-in-page", async () => {
    const token = await getSlackAuthToken();

    if (!token) {
      return;
    }

    window.close();

    slackAuthTokenBridgeValue.set(token);
  });
}

export function initializeSlackAuthHandler() {
  loginSlackBridge.handle(async () => {
    await loginSlack();
  });

  syncSlackAuthState();
}

export function syncSlackAuthState() {
  getSlackAuthToken().then((token) => {
    slackAuthTokenBridgeValue.set(token);
  });
}
