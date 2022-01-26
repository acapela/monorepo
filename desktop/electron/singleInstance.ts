import { app } from "electron";

import { appState } from "./appState";
import { initializeMainWindow } from "./mainWindow";

export function initializeSingleInstanceLock() {
  const isFirstInstance = app.requestSingleInstanceLock();

  if (!isFirstInstance) {
    app.quit();
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    const { mainWindow } = appState;
    if (!mainWindow) {
      initializeMainWindow();
      return;
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.focus();
  });
}
