import { BrowserWindow, session } from "electron";

import { clickupAuthTokenBridgeValue, loginClickUpBridge, logoutClickUpBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions } from "./utils";

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36";

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

  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (window.isDestroyed()) return;
    const url = new URL(window.webContents.getURL());
    if (url.origin !== FRONTEND_URL || !url.pathname.endsWith("done")) continue;
    if (teamId) break; // don't sign out, we just have unlinked a project
    const serviceCookies = await session.defaultSession.cookies.get({ url: "https://app.clickup.com" });
    await Promise.all(
      serviceCookies.map((cookie) => session.defaultSession.cookies.remove("https://app.clickup.com", cookie.name))
    );
    await clickupAuthTokenBridgeValue.set(false);
    break;
  }

  window.destroy();
}

export function initializeClickUpAuthHandler() {
  loginClickUpBridge.handle(() => loginClickUp());
  logoutClickUpBridge.handle((input) => logoutClickUp(input?.teamId));
}
