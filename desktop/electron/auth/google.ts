import { BrowserWindow, session } from "electron";

import { googleAuthTokenBridgeValue, loginGoogleBridge } from "@aca/desktop/bridge/auth";

import { authWindowDefaultOptions } from "./utils";

const googleURL = "https://www.google.com";

export async function getGoogleAuthToken() {
  const cookiesRequiredForBeingAuthorized = ["SSID"];
  const cookies = await session.defaultSession.cookies.get({ url: googleURL });

  const authorizedCookies = cookies.filter((cookie) => cookiesRequiredForBeingAuthorized.includes(cookie.name));

  return authorizedCookies.length === cookiesRequiredForBeingAuthorized.length;
}

export async function loginGoogle() {
  const currentToken = await getGoogleAuthToken();
  if (currentToken) {
    googleAuthTokenBridgeValue.set(true);
    console.info("Already logged in");
    return;
  }

  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL("https://accounts.google.com/servicelogin");

  window.webContents.on("did-navigate-in-page", async () => {
    const token = await getGoogleAuthToken();

    if (!token) {
      return;
    }

    window.close();

    googleAuthTokenBridgeValue.set(token);
  });
}

export function initializeGoogleAuthHandler() {
  loginGoogleBridge.handle(async () => {
    await loginGoogle();
  });

  syncGoogleAuthState();
}

export function syncGoogleAuthState() {
  getGoogleAuthToken().then((token) => {
    googleAuthTokenBridgeValue.set(token);
  });
}
