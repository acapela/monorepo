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
