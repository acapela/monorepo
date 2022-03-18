import { dialog } from "electron";
import isDev from "electron-is-dev";
import * as electronLog from "electron-log";
import { autoUpdater } from "electron-updater";

import { appUpdateAndRestartRequest, applicationStateBridge, checkForUpdatesRequest } from "@aca/desktop/bridge/system";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { createSharedPromise } from "@aca/shared/promises";

import { getMainWindow } from "./mainWindow";
import { allowWindowClosing } from "./utils/hideWindowOnClose";

const log = makeLogger("AutoUpdater");

const checkForUpdates = createSharedPromise(async () => {
  log.info("Checking for update");
  const result = await autoUpdater.checkForUpdates();
  return result;
});

export function setupAutoUpdater() {
  electronLog.transports.file.level = "info";
  autoUpdater.logger = {
    debug: (message: string) => log.debug(message),
    info: (message: string) => log.info(message),
    warn: (message: string) => log.warn(message),
    error: (message: string) => log.error(message),
  };

  const nextCheckForUpdate = async () => {
    try {
      await checkForUpdates();
    } finally {
      setTimeout(nextCheckForUpdate, 10 * 60 * 1000); // check for updates every 10 minutes
    }
  };

  nextCheckForUpdate();

  autoUpdater.on("update-downloaded", () => {
    applicationStateBridge.update({ isUpdateReadyToInstall: true, updateDownloadingPercent: null });
  });

  autoUpdater.on("download-progress", (progress) => {
    const percent = progress.percent;
    applicationStateBridge.update({ updateDownloadingPercent: percent, isUpdateReadyToInstall: false });
  });

  autoUpdater.on("error", (error) => {
    if (!isDev) {
      dialog.showErrorBox("There was a problem updating the application", `${error}`);
    }

    log.error("There was a problem updating the application", error);
  });

  appUpdateAndRestartRequest.handle(async () => {
    allowWindowClosing();
    try {
      await autoUpdater.quitAndInstall();
    } catch (error) {
      log.error(error);
      throw error;
    }
  });

  checkForUpdatesRequest.handle(async () => {
    try {
      const checkResult = await checkForUpdates();

      if (!checkResult.downloadPromise) {
        dialog.showMessageBox(getMainWindow(), { message: "App is up to date" });
      }
    } catch (error) {
      dialog.showErrorBox("Failed to check for update", `${error}`);
      log.error(error);
      throw error;
    }
  });
}
