import { app, session } from "electron";

import {
  clearAllDataRequest,
  restartAppRequest,
  toggleFullscreenRequest,
  toggleMaximizeRequest,
} from "@aca/desktop/bridge/system";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";

export function initializeSystemHandlers() {
  restartAppRequest.handle(async () => {
    app.relaunch();
    app.exit();
  });

  clearAllDataRequest.handle(async () => {
    await session.defaultSession.clearStorageData();
    app.relaunch();
    app.exit();
  });

  toggleMaximizeRequest.handle(async (_, event) => {
    if (!event) return;

    const senderWindow = getSourceWindowFromIPCEvent(event);

    if (!senderWindow) return;

    if (senderWindow.isMaximized()) {
      senderWindow.unmaximize();
    } else {
      senderWindow.maximize();
    }
  });

  toggleFullscreenRequest.handle(async (_, event) => {
    if (!event) return;

    const senderWindow = getSourceWindowFromIPCEvent(event);

    if (!senderWindow) return;

    if (senderWindow.isFullScreen()) {
      senderWindow.setFullScreen(false);
    } else {
      senderWindow.setFullScreen(true);
    }
  });
}
