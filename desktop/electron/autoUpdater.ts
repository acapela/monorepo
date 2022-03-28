import * as electronLog from "electron-log";
import { autoUpdater } from "electron-updater";

import { appUpdateAndRestartRequest, applicationStateBridge, checkForUpdatesRequest } from "@aca/desktop/bridge/system";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { createSharedPromise } from "@aca/shared/promises";

import { addToast } from "../domains/toasts/store";
import { checkAccessToInternet } from "./utils/internet";
import { allowWindowClosing } from "./windows/utils/hideWindowOnClose";

const log = makeLogger("AutoUpdater");

const checkForUpdates = createSharedPromise(async () => {
  log.info("Checking for update");
  const hasAccessToInternet = await checkAccessToInternet();

  if (!hasAccessToInternet) {
    log.info("Skipping check - no internet access");
    return null;
  }

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
    const knownErrors = ["net::ERR_CONNECTION_RESET", "HttpError: 404", "net::ERR_NETWORK_IO_SUSPENDED"];

    const errorMessage = `${error}`;

    const isIgnoredError = knownErrors.some((knownError) => {
      errorMessage.includes(knownError);
    });

    if (isIgnoredError) {
      log.info(`Failed with known error`, error.message);
      return;
    }

    // TODO: Update errors are super prevalent right now, bring back toast if
    // todo: we get more stable
    // ignore isDev if ELECTRON_IS_DEV=0 (we use this for e2e tests)
    // if (!isDev && process.env.ELECTRON_IS_DEV !== "0") {
    //   addToast({ title: "Error updating the application", message: error.message });
    // }

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

      if (checkResult === null) {
        addToast({
          title: "Did not check app updates",
          message: "Seems you have no access to the internet",
          durationMs: 10 * 1000,
        });
        return;
      }

      if (!checkResult.downloadPromise) {
        addToast({
          message: "App is up to date",
          durationMs: 8 * 1000,
        });
      }
    } catch (error) {
      addToast({
        title: "Failed to update",
        message: (error as Error)?.message ? (error as Error).message : (error as string),
        durationMs: 10 * 1000,
      });
      log.error(error);
      throw error;
    }
  });
}
