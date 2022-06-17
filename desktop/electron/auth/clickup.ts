import axios from "axios";
import { BrowserWindow } from "electron";

import { clickupAuthTokenBridgeValue, loginClickUpBridge, logoutClickUpBridge } from "@aca/desktop/bridge/auth";
import { getAcapelaAuthToken } from "@aca/desktop/electron/auth/acapela";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { RETRY_DELAY_MS, authWindowDefaultOptions, userAgent } from "./utils";

export async function loginClickUp() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/clickup/auth", { userAgent });

  return new Promise<void>((resolve, reject) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) {
        reject(new Error("Window closed before authorized"));
        return;
      }
      const url = window.webContents.getURL();
      if (url.startsWith(FRONTEND_URL) && url.split("?")[0].endsWith("callback")) {
        clickupAuthTokenBridgeValue.set(true);
        resolve();

        window.close();

        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutClickUp(teamId?: string) {
  const acapelaAuthToken = await getAcapelaAuthToken();
  await axios.get(`${FRONTEND_URL}/api/backend/v1/clickup/unlink${teamId ? "/" + teamId : ""}`, {
    headers: { Cookie: `next-auth.session-token=${acapelaAuthToken}` },
  });

  if (teamId) return; // don't sign out, we just have unlinked a project

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
  await window.webContents.loadURL("https://app.clickup.com", { userAgent });

  await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  if (window.isDestroyed()) return;
  await window.webContents.executeJavaScript("localStorage.clear();", true);
  await clickupAuthTokenBridgeValue.set(false);

  window.destroy();
}

export function initializeClickUpAuthHandler() {
  loginClickUpBridge.handle(() => loginClickUp());
  logoutClickUpBridge.handle((input) => logoutClickUp(input?.teamId));
}
