import { BrowserWindow } from "electron";

import { trackEvent } from "@aca/desktop/analytics";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";

import { authWindowDefaultOptions } from "./utils";

export function initializeSlackAuthHandler() {
  connectSlackBridge.handle(async ({ url }) => {
    const window = new BrowserWindow({ ...authWindowDefaultOptions });
    await window.webContents.loadURL(url);
    return () => {
      window.destroy();
      trackEvent("Slack Integration Added"); // TODO: is this actually the right place for tracking this?
    };
  });
}
