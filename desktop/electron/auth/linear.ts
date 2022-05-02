import { BrowserWindow } from "electron";

import { linearAuthTokenBridgeValue, loginLinearBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { RETRY_DELAY_MS, RETRY_TIMES, authWindowDefaultOptions, userAgent } from "./utils";

export async function loginLinear() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/linear/auth", { userAgent });

  return new Promise<void>((resolve) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) return;
      const url = window.webContents.getURL();
      if (url.startsWith(FRONTEND_URL) && url.split("?")[0].endsWith("callback")) {
        linearAuthTokenBridgeValue.set(true);
        window.close();
        resolve();
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutLinear() {
  const window = new BrowserWindow({
    opacity: 0,
    transparent: false,
    alwaysOnTop: true,
    focusable: false,
    width: 100,
    height: 100,
    x: 1,
    y: 1,
  });
  window.setIgnoreMouseEvents(true);

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/linear/unlink", { userAgent });

  for (let i = 0; i < RETRY_TIMES; i++) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    if (window.isDestroyed()) return;
    if (!window.webContents.getURL().startsWith("https://linear.app")) continue;
    await window.webContents.executeJavaScript('localStorage.removeItem("ApplicationStore");', true);
    await linearAuthTokenBridgeValue.set(false);
    break;
  }

  window.close();
}

export function initializeLinearAuthHandler() {
  loginLinearBridge.handle(async (input) => {
    if (input?.logout) return logoutLinear();
    return loginLinear();
  });
}
