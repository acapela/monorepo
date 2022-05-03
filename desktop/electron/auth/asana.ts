import { BrowserWindow, session } from "electron";

import { asanaAuthTokenBridgeValue, loginAsanaBridge, logoutAsanaBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { RETRY_DELAY_MS, RETRY_TIMES, authWindowDefaultOptions, userAgent } from "./utils";

export async function loginAsana() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/asana/auth", { userAgent });

  return new Promise<void>((resolve) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) return;
      const url = window.webContents.getURL();
      if (url.startsWith(FRONTEND_URL) && url.split("?")[0].endsWith("callback")) {
        asanaAuthTokenBridgeValue.set(true);
        window.close();
        resolve();
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutAsana(webhookId?: string) {
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
  await window.webContents.loadURL(`${FRONTEND_URL}/api/backend/v1/asana/unlink${webhookId ? "/" + webhookId : ""}`, {
    userAgent,
  });

  for (let i = 0; i < RETRY_TIMES; i++) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    if (window.isDestroyed()) return;
    const url = new URL(window.webContents.getURL());
    if (url.origin !== FRONTEND_URL || !url.pathname.endsWith("done")) continue;
    if (webhookId) break; // don't sign out, we just have unlinked a project
    const serviceCookies = await session.defaultSession.cookies.get({ url: "https://app.asana.com" });
    await Promise.all(
      serviceCookies.map((cookie) => session.defaultSession.cookies.remove("https://app.asana.com", cookie.name))
    );
    await asanaAuthTokenBridgeValue.set(false);
    break;
  }

  window.destroy();
}

export function initializeAsanaAuthHandler() {
  loginAsanaBridge.handle(() => loginAsana());
  logoutAsanaBridge.handle((input) => logoutAsana(input?.webhookId));
}
