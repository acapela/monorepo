import "@aca/desktop/lib/env"; // import for side effects

import "./globals";

import * as Sentry from "@sentry/electron";
import { app, protocol } from "electron";
import IS_DEV from "electron-is-dev";
import { runInAction } from "mobx";

import { InitializeLogger } from "@aca/desktop/domains/dev/logger";
import { makeLogger, registerLoggerErrorReporter } from "@aca/desktop/domains/dev/makeLogger";

import { initializeServiceSync } from "./apps";
import { appState } from "./appState";
import { setupAutoUpdater } from "./autoUpdater";
import { initializeBridgeHandlers } from "./bridgeHandlers";
import { initializeGlobalShortcuts } from "./globalShortcuts";
import { initializeMainWindow } from "./mainWindow";
import { initializeProtocolHandlers } from "./protocol";
import { initializeDefaultSession } from "./session";
import { initializeSingleInstanceLock } from "./singleInstance";

registerLoggerErrorReporter((body) => {
  try {
    if (body.length === 1) {
      Sentry.captureException(body[0]);
      return;
    }
    Sentry.captureException(JSON.stringify(body));
  } catch (error) {
    // We're doomed!
  }
});

// Mark default scheme as secure, thus allowing us to make credentialed requests for secure sites
protocol.registerSchemesAsPrivileged([{ scheme: IS_DEV ? "http" : "file", privileges: { secure: true } }]);

if (!IS_DEV) {
  // Has to be done before app ready
  initializeSingleInstanceLock();
}

const log = makeLogger("Electron-Boot-Sequence");

function initializeApp() {
  log.info(`Initialize bridge handlers`);
  initializeBridgeHandlers();

  log.info(`Initialize protocol handlers`);
  initializeProtocolHandlers();

  log.info(`Initialize main window`);
  initializeMainWindow();

  log.info(`Initialize logger`);
  InitializeLogger();

  log.info(`Initialize service sync`);
  initializeServiceSync();

  initializeGlobalShortcuts();

  initializeDefaultSession();

  setupAutoUpdater();
}

log.info(`Waiting for app ready`);
app.on("ready", () => {
  log.info(`Electron App is ready`);
  runInAction(initializeApp);
});

///
app.on("window-all-closed", () => {
  // On Mac - closing app window does not quit it - it can still be visible in system 'cmd-tab' etc.
  if (process.platform === "darwin") {
    return;
  }
  app.quit();
});

// If all windows are closed and you eg 'cmd-tab' into the app - re-initialize the window
app.on("activate", () => {
  if (!appState.mainWindow) {
    initializeMainWindow();
  }
});
