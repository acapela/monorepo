import { BrowserWindow } from "electron";

import { clickupAuthTokenBridgeValue, loginClickUpBridge, logoutClickUpBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { RETRY_DELAY_MS, RETRY_TIMES, authWindowDefaultOptions, userAgent } from "./utils";

export async function loginClickUp() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/clickup/auth", { userAgent });

  return new Promise<void>((resolve) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) return;
      const url = window.webContents.getURL();
      if (url.startsWith(FRONTEND_URL) && url.split("?")[0].endsWith("callback")) {
        clickupAuthTokenBridgeValue.set(true);
        window.close();
        resolve();
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutClickUp(teamId?: string) {
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
  await window.webContents.loadURL(`${FRONTEND_URL}/api/backend/v1/clickup/unlink${teamId ? "/" + teamId : ""}`, {
    userAgent,
  });

  for (let i = 0; i < RETRY_TIMES; i++) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    if (window.isDestroyed()) return;
    const url = new URL(window.webContents.getURL());
    if (url.origin !== FRONTEND_URL || !url.pathname.endsWith("done")) continue;
    if (teamId) break; // don't sign out, we just have unlinked a project

    await window.loadURL("https://app.clickup.com", { userAgent });
    await window.webContents.executeJavaScript("localStorage.clear();", true);
    await clickupAuthTokenBridgeValue.set(false);
    break;
  }

  window.destroy();
}

export function initializeClickUpAuthHandler() {
  loginClickUpBridge.handle(() => loginClickUp());
  logoutClickUpBridge.handle((input) => logoutClickUp(input?.teamId));
}
