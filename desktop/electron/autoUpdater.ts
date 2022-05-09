import { app, dialog } from "electron";
import * as electronLog from "electron-log";
import { autoUpdater } from "electron-updater";

import { appUpdateAndRestartRequest, applicationStateBridge, checkForUpdatesRequest } from "@aca/desktop/bridge/system";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { createSharedPromise } from "@aca/shared/promises";

import { addToast } from "../domains/toasts/store";
import { checkAccessToInternet } from "./utils/internet";
import { getMainWindow } from "./windows/mainWindow";
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

async function ensureAppInApplicationsFolder() {
  if (app.isInApplicationsFolder()) {
    return true;
  }

  const mainWindow = getMainWindow();

  if (!mainWindow) return false;

  const dialogResponse = await dialog.showMessageBox(mainWindow, {
    title: `Move Acapela to "Applications" folder`,
    message: "In order to install app update - Acapela needs to be in your Applications folder",
    buttons: ["Cancel", `Move to "Applications" folder`],
    cancelId: 0,
    defaultId: 1,
  });

  if (dialogResponse.response !== 1) {
    return false;
  }

  const didMove = app.moveToApplicationsFolder();

  return didMove;
}

/**
 * Should be only called when we know update is avaliable
 */
async function installAppUpdate() {
  allowWindowClosing();
  await autoUpdater.quitAndInstall();
}

/**
 * Will try to install downloaded update with additional recovery handling
 */
async function startUpdateInstallFlow() {
  /**
   * Let's just try to install it and only if it doesnt - perform additional checks
   */
  try {
    await installAppUpdate();
    return;
  } catch (error) {
    log.warn("Failed to install app update - will try to perform recovery path", error);
  }

  // Auto-update did not work - let's try to resolve the problem
  try {
    let isAppInApplicationsFolder;
    try {
      isAppInApplicationsFolder = await ensureAppInApplicationsFolder();
    } catch (error) {
      // User allowed moving the app - but it did fail
      dialog.showErrorBox(
        `Failed to move Acapela to "Applications" folder`,
        `You can try to close Acapela app, move it manually and open Acapela app again.`
      );
      log.error(error, "Failed to move app to applications folder");
      return;
    }

    if (!isAppInApplicationsFolder) {
      dialog.showErrorBox(
        "Cannot install update",
        `Update cannot be installed if Acapela is not moved "Applications" folder.`
      );
      log.warn("Update is not installed because user rejected moving the app to applications folder");
      return;
    }

    await installAppUpdate();
  } catch (error) {
    log.error(error, "Failed to install app update");
    throw error;
  }
}

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

  appUpdateAndRestartRequest.handle(startUpdateInstallFlow);

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
          title: "App status",
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
