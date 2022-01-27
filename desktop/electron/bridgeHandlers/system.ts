import { BrowserWindow, app, session } from "electron";

import { clearAllData, restartApp, toggleMaximize } from "@aca/desktop/bridge/system";

export function initializeSystemHandlers() {
  restartApp.handle(async () => {
    app.relaunch();
    app.exit();
  });

  clearAllData.handle(async () => {
    await session.defaultSession.clearStorageData();
    app.relaunch();
    app.exit();
  });

  toggleMaximize.handle(async (_, event) => {
    // Let's maximize the window that sent the event (usually or always will be mainWindow, but just in case)
    const windowId = event?.frameId;

    if (!windowId) return;

    const senderWindow = BrowserWindow.fromId(windowId);

    if (!senderWindow) return;

    if (senderWindow.isMaximized()) {
      senderWindow.unmaximize();
    } else {
      senderWindow.maximize();
    }
  });
}
