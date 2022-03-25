import { BrowserWindow } from "electron";

import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions } from "./utils";

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36";

export async function loginGitHub() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/github/auth", { userAgent });

  return new Promise<void>((resolve) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) return;
      const url = window.webContents.getURL();
      const { origin, pathname } = new URL(url);
      //TODO
      const ghMatch =
        origin === "https://github.com" && /^\/(organizations\/(.+)\/)?settings\/installations\/(\d+)$/.exec(pathname);
      if (ghMatch) {
        const organization = ghMatch[2];
        const installationId = ghMatch[3];
        const query = organization ? `?org=${organization}` : "";
        window.webContents.loadURL(FRONTEND_URL + `/api/backend/v1/github/link/${installationId}${query}`, {
          userAgent,
        });
      }
      if (origin === FRONTEND_URL && pathname.endsWith("done")) {
        githubAuthTokenBridgeValue.set(true);
        window.close();
        resolve();
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function logoutGitHub() {
  // const window = new BrowserWindow({
  //   opacity: 0,
  //   transparent: false,
  //   alwaysOnTop: true,
  //   focusable: false,
  //   width: 100,
  //   height: 100,
  //   x: 1,
  //   y: 1,
  // });
  // window.setIgnoreMouseEvents(true);
  //
  // await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/linear/unlink", { userAgent });
  //
  // for (let i = 0; i < 30; i++) {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   if (window.isDestroyed()) return;
  //   if (!window.webContents.getURL().startsWith("https://linear.app")) continue;
  //   await window.webContents.executeJavaScript('localStorage.removeItem("ApplicationStore");', true);
  //   githubAuthTokenBridgeValue.set(false);
  //   break;
  // }
  //
  // window.close();
  await githubAuthTokenBridgeValue.set(false);
}

export function initializeGitHubAuthHandler() {
  loginGitHubBridge.handle(async (input) => {
    if (input?.logout) return logoutGitHub();
    return loginGitHub();
  });
}
