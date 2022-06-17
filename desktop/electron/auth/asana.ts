import axios from "axios";
import { BrowserWindow, session } from "electron";

import { asanaAuthTokenBridgeValue, loginAsanaBridge, logoutAsanaBridge } from "@aca/desktop/bridge/auth";
import { getAcapelaAuthToken } from "@aca/desktop/electron/auth/acapela";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions, userAgent } from "./utils";

export async function loginAsana() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/asana/auth", { userAgent });

  return new Promise<void>((resolve, reject) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) {
        reject(new Error("Window closed before authorized"));
        return;
      }
      const url = window.webContents.getURL();
      if (url.startsWith(FRONTEND_URL) && url.split("?")[0].endsWith("callback")) {
        asanaAuthTokenBridgeValue.set(true);

        resolve();
        window.close();
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutAsana(webhookId?: string) {
  const acapelaAuthToken = await getAcapelaAuthToken();
  await axios.get(`${FRONTEND_URL}/api/backend/v1/asana/unlink${webhookId ? "/" + webhookId : ""}`, {
    headers: { Cookie: `next-auth.session-token=${acapelaAuthToken}` },
  });
  if (webhookId) return; // don't sign out, we just have unlinked a project

  const serviceCookies = await session.defaultSession.cookies.get({ url: "https://app.asana.com" });
  await Promise.all(
    serviceCookies.map((cookie) => session.defaultSession.cookies.remove("https://app.asana.com", cookie.name))
  );
  await asanaAuthTokenBridgeValue.set(false);
}

export function initializeAsanaAuthHandler() {
  loginAsanaBridge.handle(() => loginAsana());
  logoutAsanaBridge.handle((input) => logoutAsana(input?.webhookId));
}
