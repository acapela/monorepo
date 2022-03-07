import { BrowserWindow, app, session, shell } from "electron";

import { authTokenBridgeValue, logoutBridge } from "@aca/desktop/bridge/auth";
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
  waitForDoNotDisturbToFinish,
} from "@aca/desktop/bridge/system";
import { appState } from "@aca/desktop/electron/appState";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { FRONTEND_URL } from "@aca/desktop/lib/env";
import { autorunEffect } from "@aca/shared/mobx/utils";

import { getAcapelaAuthToken } from "../auth/acapela";
import { clearPersistance } from "./persistance";
import { waitForDoNotDisturbToEnd } from "./utils/doNotDisturb";

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

  waitForDoNotDisturbToFinish.handle(async () => {
    await waitForDoNotDisturbToEnd();
  });

  logoutBridge.handle(async () => {
    if (!(await getAcapelaAuthToken())) {
      authTokenBridgeValue.set(null);

      return;
    }

    const logoutWindow = new BrowserWindow({ opacity: 0, width: 10, height: 10 });

    logoutWindow.setIgnoreMouseEvents(true);

    async function handleMaybeLoggedOut() {
      const acapelaAuthToken = await getAcapelaAuthToken();

      const stillHasAuthToken = !!acapelaAuthToken;

      if (stillHasAuthToken) return;

      session.defaultSession.cookies.off("changed", handleMaybeLoggedOut);

      authTokenBridgeValue.set(null);

      logoutWindow.close();
    }

    session.defaultSession.cookies.on("changed", handleMaybeLoggedOut);

    await logoutWindow.webContents.loadURL(`${FRONTEND_URL}/logout`);
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
    // While the type definitions disagree, it is possible to use a string.
    // Apparently Slack also uses this to set an indeterminate badge:
    // https://github.com/electron/electron/issues/6533#issue-166218687
    app.setBadgeCount(count as number);
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
