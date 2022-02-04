import { app, session, shell } from "electron";

import {
  clearAllDataRequest,
  isFullscreenValue,
  openLinkRequest,
  restartAppRequest,
  toggleDevtoolsRequest,
  toggleFullscreenRequest,
  toggleMaximizeRequest,
} from "@aca/desktop/bridge/system";
import { appState } from "@aca/desktop/electron/appState";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { autorunEffect } from "@aca/shared/mobx/utils";

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

  toggleDevtoolsRequest.handle(async (alsoMaximize, event) => {
    if (!event) return;

    const senderWindow = getSourceWindowFromIPCEvent(event);

    if (!senderWindow) return;

    if (alsoMaximize) {
      senderWindow.maximize();
    }
    senderWindow.webContents.toggleDevTools();
  });

  openLinkRequest.handle(async ({ url }) => {
    shell.openExternal(url);
  });

  autorunEffect(() => {
    const { mainWindow } = appState;

    if (!mainWindow) return;

    isFullscreenValue.set(mainWindow.isFullScreen());

    const handleEnterFullscreen = () => isFullscreenValue.set(true);
    const handleLeaveFullscreen = () => isFullscreenValue.set(false);

    mainWindow.on("enter-full-screen", handleEnterFullscreen);
    mainWindow.on("leave-full-screen", handleLeaveFullscreen);

    return () => {
      mainWindow.off("enter-full-screen", handleEnterFullscreen);
      mainWindow.off("leave-full-screen", handleLeaveFullscreen);
    };
  });
}
