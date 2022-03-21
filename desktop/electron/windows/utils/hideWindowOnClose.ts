import { BrowserWindow, app } from "electron";

let isClosingWindowAllowed = false;

/**
 * Important note!
 *
 * We need auto-updater to be able to close the windows in order to perform update.
 */

export function allowWindowClosing() {
  isClosingWindowAllowed = true;
}

export function handleHideWindowOnClose(window: BrowserWindow) {
  app.on("before-quit", () => {
    isClosingWindowAllowed = true;
  });

  window.on("close", (event) => {
    if (isClosingWindowAllowed) {
      // Simply allow it normally
      return;
    }

    // hide window instead of closing it.
    event.preventDefault();
    window.hide();
  });

  app.on("activate", () => {
    window.show();
  });
}
