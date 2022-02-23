import { BrowserWindow, session } from "electron";

import { clearServiceCookiesBridge, figmaAuthTokenBridgeValue, loginFigmaBridge } from "@aca/desktop/bridge/auth";
import { tryInitializeServiceSync } from "@aca/desktop/electron/apps";

import { authWindowDefaultOptions } from "./utils";

export const figmaURL = "https://www.figma.com";

export async function getFigmaAuthToken() {
  const cookies = await session.defaultSession.cookies.get({ url: figmaURL });

  const sessionCookie = cookies.find((cookie) => cookie.name === "figma.mst");

  if (!sessionCookie) return null;

  return sessionCookie.value;
}

export async function loginFigma() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  window.webContents.loadURL(figmaURL + "/login");

  return new Promise<void>((resolve) => {
    window.webContents.on("did-navigate-in-page", async () => {
      const token = await getFigmaAuthToken();

      if (!token) {
        return;
      }

      window.close();

      figmaAuthTokenBridgeValue.set(token);
      resolve();
    });
  });
}

export function initializeFigmaAuthHandler() {
  loginFigmaBridge.handle(async () => {
    await loginFigma();
    tryInitializeServiceSync("figma");
  });

  getFigmaAuthToken().then((token) => {
    figmaAuthTokenBridgeValue.set(token);
  });
}

export function clearFigmaSessionData() {
  figmaAuthTokenBridgeValue.reset();
  clearServiceCookiesBridge({ url: figmaURL });
}
