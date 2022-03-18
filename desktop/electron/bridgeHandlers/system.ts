import { BrowserWindow, app, session, shell } from "electron";

import { authTokenBridgeValue, logoutBridge } from "@aca/desktop/bridge/auth";
import {
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
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { FRONTEND_URL } from "@aca/desktop/lib/env";

import { getAcapelaAuthToken } from "../auth/acapela";
import { getMainWindow } from "../mainWindow";
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

    async function waitForLogout() {
      if (!(await getAcapelaAuthToken())) {
        log.info("initial");

        return;
      }

      return new Promise<void>((resolve) => {
        async function handleCookiesChange() {
          if (await getAcapelaAuthToken()) {
            log.info("still has");
            return;
          }

          log.info("cookie change dont have");

          session.defaultSession.cookies.off("changed", handleCookiesChange);

          resolve();
        }

        session.defaultSession.cookies.on("changed", handleCookiesChange);
      });
    }

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

      await waitForLogout();

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
}
