import { BrowserWindow, app } from "electron";

export function handleHideWindowOnClose(window: BrowserWindow) {
  let isQuittingApp = false;

  /**
   * Important note: this is safe for auto-updater and will not prevent app quit
   * From docs of: autoUpdater.quitAndInstall:
   * > Note: autoUpdater.quitAndInstall() will close all application windows first and only emit before-quit event on app after that. This is different from the normal quit event sequence.
   */
  app.on("before-quit", () => {
    isQuittingApp = true;
  });

  window.on("close", (event) => {
    if (!isQuittingApp) {
      event.preventDefault();
      window.hide();
    }
  });

  app.on("activate", () => {
    window.show();
  });
}
