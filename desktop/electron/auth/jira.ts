import { BrowserWindow } from "electron";

import { jiraAuthTokenBridgeValue, loginJiraBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions } from "./utils";

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36";

export async function loginJira() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/auth/atlassian", { userAgent });

  return new Promise<void>((resolve) => {
    window.webContents.on("did-navigate-in-page", async () => {
      if (window.webContents.getURL().includes("/auth/success")) {
        jiraAuthTokenBridgeValue.set(true);
        window.close();

        resolve();
      }
    });
  });
}

// TODO
export async function logoutJira() {
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
  // await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/linear/unlink", { userAgent });
  // for (let i = 0; i < 30; i++) {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   if (window.isDestroyed()) return;
  //   if (!window.webContents.getURL().startsWith("https://linear.app")) continue;
  //   await window.webContents.executeJavaScript('localStorage.removeItem("ApplicationStore");', true);
  //   linearAuthTokenBridgeValue.set(false);
  //   break;
  // }
  // window.close();
}

export function initializeJiraAuthHandler() {
  loginJiraBridge.handle(async (input) => {
    if (input?.logout) return logoutJira();
    return loginJira();
  });
}
