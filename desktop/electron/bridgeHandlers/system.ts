import { BrowserWindow, app, session, shell } from "electron";

import { authTokenBridgeValue, logoutBridge } from "@aca/desktop/bridge/auth";
import {
  clearAllDataRequest,
  focusMainViewRequest,
  openLinkRequest,
  restartAppRequest,
  setBadgeCountRequest,
  showMainWindowRequest,
  toggleDevtoolsRequest,
  toggleFullscreenRequest,
  toggleMaximizeRequest,
  waitForDoNotDisturbToFinish,
} from "@aca/desktop/bridge/system";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { FRONTEND_URL } from "@aca/desktop/lib/env";
import { wait } from "@aca/shared/time";

import { focusMainView, getMainWindow } from "../windows/mainWindow";
import { clearPersistance } from "./persistance";
import { waitForDoNotDisturbToEnd } from "./utils/doNotDisturb";

const log = makeLogger("System");

async function restartApp() {
  app.relaunch();
  app.exit();
}

export function initializeSystemHandlers() {
  restartAppRequest.handle(restartApp);

  clearAllDataRequest.handle(async () => {
    await clearPersistance();
    await session.defaultSession.clearStorageData();
    await session.defaultSession.clearCache();
    await restartApp();
  });

  showMainWindowRequest.handle(async () => {
    getMainWindow().show();
  });

  waitForDoNotDisturbToFinish.handle(async () => {
    await waitForDoNotDisturbToEnd();
  });

  logoutBridge.handle(async () => {
    log("Logging out");

    async function clearLocalAcapelaData() {
      const cookies = await session.defaultSession.cookies.get({ url: FRONTEND_URL });

      log.info(JSON.stringify(cookies));

      const cookiesRemovals = cookies.map((cookie) => {
        return session.defaultSession.cookies.remove(FRONTEND_URL, cookie.name);
      });

      await Promise.all(cookiesRemovals);

      // Allow electron to persist before we restart the app
      await authTokenBridgeValue.set(null);
    }

    try {
      const logoutView = new BrowserWindow({ opacity: 0 });

      logoutView.setIgnoreMouseEvents(true);

      await logoutView.webContents.loadURL(`${FRONTEND_URL}/logout`);

      // let's give the frontend some time to call the next-auth logout api
      await wait(1500);

      logoutView.close();

      await clearLocalAcapelaData();

      restartApp();
    } catch (error) {
      log.error(error as Error, "failed to log out");
    }
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

  focusMainViewRequest.handle(async () => {
    focusMainView();
  });
}
