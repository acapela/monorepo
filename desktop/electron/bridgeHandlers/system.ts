import { app, session } from "electron";

import { clearAllData, requestRestartApp, toggleMaximize } from "@aca/desktop/bridge/system";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";

export function initializeSystemHandlers() {
  requestRestartApp.handle(async () => {
    app.relaunch();
    app.exit();
  });

  clearAllData.handle(async () => {
    await session.defaultSession.clearStorageData();
    app.relaunch();
    app.exit();
  });

  toggleMaximize.handle(async (_, event) => {
    if (!event) return;

    const senderWindow = getSourceWindowFromIPCEvent(event);

    if (!senderWindow) return;

    if (senderWindow.isMaximized()) {
      senderWindow.unmaximize();
    } else {
      senderWindow.maximize();
    }
  });
}
