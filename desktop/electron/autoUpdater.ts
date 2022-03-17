import * as electronLog from "electron-log";
import { autoUpdater } from "electron-updater";

import { appUpdateAndRestartRequest, applicationStateBridge, checkForUpdatesRequest } from "@aca/desktop/bridge/system";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { createSharedPromise } from "@aca/shared/promises";

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
    await checkForUpdates();
    setTimeout(nextCheckForUpdate, 10 * 60 * 1000); // check for updates every 10 minutes
  };

  nextCheckForUpdate();

  autoUpdater.on("error", (error) => {
    log.error(error);
  });

  autoUpdater.on("update-downloaded", () => {
    applicationStateBridge.update({ isUpdateReadyToInstall: true, updateDownloadingPercent: null });
  });

  autoUpdater.on("download-progress", (progress) => {
    const percent = progress.percent;
    applicationStateBridge.update({ updateDownloadingPercent: percent, isUpdateReadyToInstall: false });
  });

  autoUpdater.on("error", (message) => {
    log.error("There was a problem updating the application", message);
  });

  appUpdateAndRestartRequest.handle(async () => {
    try {
      await autoUpdater.quitAndInstall();
    } catch (error) {
      log.error(error);
      throw error;
    }
  });

  checkForUpdatesRequest.handle(async () => {
    try {
      await checkForUpdates();
    } catch (error) {
      log.error(error);
      throw error;
    }
  });
}
