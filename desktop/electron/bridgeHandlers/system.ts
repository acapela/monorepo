import { app, session, shell } from "electron";

import {
  applicationStateBridge,
  clearAllDataRequest,
  openLinkRequest,
  restartAppRequest,
  setBadgeCountRequest,
  showMainWindowRequest,
  toggleDevtoolsRequest,
  toggleFullscreenRequest,
  toggleMaximizeRequest,
} from "@aca/desktop/bridge/system";
import { appState } from "@aca/desktop/electron/appState";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { autorunEffect } from "@aca/shared/mobx/utils";

import { clearPersistance } from "./persistance";

export function initializeSystemHandlers() {
  restartAppRequest.handle(async () => {
    app.relaunch();
    app.exit();
  });

  clearAllDataRequest.handle(async () => {
    await clearPersistance();
    await session.defaultSession.clearStorageData();
    app.relaunch();
    app.exit();
  });

  showMainWindowRequest.handle(async () => {
    appState.mainWindow?.show();
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

  setBadgeCountRequest.handle(async (count) => {
    app.setBadgeCount(count);
  });

  autorunEffect(() => {
    const { mainWindow } = appState;

    if (!mainWindow) return;

    applicationStateBridge.update({ isFullscreen: mainWindow.isFullScreen() });

    const handleEnterFullscreen = () => applicationStateBridge.update({ isFullscreen: true });
    const handleLeaveFullscreen = () => applicationStateBridge.update({ isFullscreen: false });

    mainWindow.on("enter-full-screen", handleEnterFullscreen);
    mainWindow.on("leave-full-screen", handleLeaveFullscreen);

    return () => {
      mainWindow.off("enter-full-screen", handleEnterFullscreen);
      mainWindow.off("leave-full-screen", handleLeaveFullscreen);
    };
  });
}
