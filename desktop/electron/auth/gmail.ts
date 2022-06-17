import { BrowserWindow } from "electron";

import { loginGmailBridge } from "@aca/desktop/bridge/auth";
import { authWindowDefaultOptions } from "@aca/desktop/electron/auth/utils";
import { FRONTEND_URL } from "@aca/desktop/lib/env";
import { GOOGLE_AUTH_WITH_GMAIL_SCOPES } from "@aca/shared/google";

export function initializeGmailAuthHandler() {
  loginGmailBridge.handle(async () => {
    const window = new BrowserWindow({ ...authWindowDefaultOptions });
    await window.webContents.loadURL(
      `${FRONTEND_URL}/auth/sign-in?${new URLSearchParams({
        provider: "google",
        scope: GOOGLE_AUTH_WITH_GMAIL_SCOPES,
      })}`
    );
    return new Promise<void>((resolve, reject) => {
      window.once("closed", () => {
        reject(new Error("Window closed before authorized"));
      });
      window.webContents.on("did-navigate-in-page", async () => {
        if (window.webContents.getURL().includes("/auth/success")) {
          resolve();
          window.close();
        }
      });
    });
  });
}
