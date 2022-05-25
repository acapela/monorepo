import axios from "axios";
import { BrowserWindow } from "electron";

import { linearAuthTokenBridgeValue, loginLinearBridge } from "@aca/desktop/bridge/auth";
import { getAcapelaAuthToken } from "@aca/desktop/electron/auth/acapela";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { RETRY_DELAY_MS, authWindowDefaultOptions, userAgent } from "./utils";

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
  const acapelaAuthToken = await getAcapelaAuthToken();
  await axios.get(`${FRONTEND_URL}/api/backend/v1/linear/unlink`, {
    headers: { Cookie: `next-auth.session-token=${acapelaAuthToken}` },
  });

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

  await window.webContents.loadURL("https://linear.app", { userAgent });

  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  if (window.isDestroyed()) return;
  await window.webContents.executeJavaScript('localStorage.removeItem("ApplicationStore");', true);
  await linearAuthTokenBridgeValue.set(false);

  window.close();
}

export function initializeLinearAuthHandler() {
  loginLinearBridge.handle(async (input) => {
    if (input?.logout) return logoutLinear();
    return loginLinear();
  });
}
