import { BrowserWindow } from "electron";

import { trackingEvent } from "@aca/desktop/analytics";
import { linearAuthTokenBridgeValue, loginLinearBridge } from "@aca/desktop/bridge/auth";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { authWindowDefaultOptions } from "./utils";

export async function loginLinear() {
  const window = new BrowserWindow({ ...authWindowDefaultOptions });

  await window.webContents.loadURL(FRONTEND_URL + "/api/backend/v1/linear/auth");

  // LOGOUT
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // console.log(await window.webContents.executeJavaScript('localStorage.removeItem("ApplicationStore")'));

  return new Promise<void>((resolve) => {
    function checkIfCallbackSuccessful() {
      if (window.isDestroyed()) return;
      const url = window.webContents.getURL();
      if (url.startsWith(FRONTEND_URL) && url.split("?")[0].endsWith("callback")) {
        linearAuthTokenBridgeValue.set(true);
        window.close();
        resolve();
        trackingEvent("Linear Integration Added");
        return;
      }
      setTimeout(checkIfCallbackSuccessful, 1000);
    }

    checkIfCallbackSuccessful();
  });
}

export async function initializeLinearAuthHandler() {
  loginLinearBridge.handle(async () => {
    await loginLinear();
  });
}
