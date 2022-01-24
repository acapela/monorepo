import { app, session } from "electron";

import { clearAllData, restartApp } from "@aca/desktop/bridge/system";

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
}
