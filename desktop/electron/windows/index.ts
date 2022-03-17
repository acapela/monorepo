import { BrowserWindow } from "electron";

import { handleCreatingNewWindow } from "./newWindowHandler";
import { handleOverlayWindowFocusing, overlayWindowHandler } from "./overlay";

export function initializeChildWindowHandlers(parentWindow: BrowserWindow) {
  handleOverlayWindowFocusing();

  parentWindow.webContents.setWindowOpenHandler(({ url, features }) => {
    if (url !== "about:blank") {
      return { action: "deny" };
    }

    // return;
    // return { action: "deny" };

    if (features === "overlay=true") {
      console.log("overlay here go");
      return handleCreatingNewWindow(overlayWindowHandler, parentWindow);
    }

    return handleCreatingNewWindow(
      {
        overrides: {
          paintWhenInitiallyHidden: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
          },
        },
      },
      parentWindow
    );
  });
}
