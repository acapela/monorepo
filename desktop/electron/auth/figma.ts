import { BrowserWindow, session } from "electron";

import { figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";

import { authWindowDefaultOptions } from "./utils";

export const figmaURL = "https://www.figma.com";

export async function getFigmaAuthToken() {
  const cookies = await session.defaultSession.cookies.get({ url: figmaURL });

  const sessionCookie = cookies.find((cookie) => cookie.name === "figma.session");

  if (!sessionCookie) return null;

  return sessionCookie.value;
}

export async function loginFigma() {
  const currentToken = await getFigmaAuthToken();
  if (currentToken) {
    figmaAuthTokenBridgeValue.set(currentToken);
    console.info("Already logged in");
    return;
  }

  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(figmaURL + "/login");

  window.webContents.on("did-navigate-in-page", async () => {
    const token = await getFigmaAuthToken();

    if (!token) {
      return;
    }

    window.close();

    figmaAuthTokenBridgeValue.set(token);
  });
}

export async function initializeFigmaAuthHandler() {
  loginFigmaBridge.handle(async () => {
    await loginFigma();
  });

  getFigmaAuthToken().then((token) => {
    figmaAuthTokenBridgeValue.set(token);
  });
}
