import "@aca/desktop/lib/env"; // import for side effects

import "./globals";

import * as Sentry from "@sentry/electron";
import { app, protocol } from "electron";
import IS_DEV from "electron-is-dev";
import { runInAction } from "mobx";
import { register, setLogger } from "trace-unhandled";

import { InitializeLogger } from "@aca/desktop/domains/dev/logger";
import { makeLogger, registerLogEntryHandler, registerLoggerErrorReporter } from "@aca/desktop/domains/dev/makeLogger";

import { logStorage } from "../bridge/logger";
import { initializeServiceSync } from "./apps";
import { setupAutoUpdater } from "./autoUpdater";
import { initializeBridgeHandlers } from "./bridgeHandlers";
import { initializeDarkModeHandling } from "./darkMode";
import { initializeGlobalShortcuts } from "./globalShortcuts";
import { initializeIpcBroadcast } from "./ipcBroadcast";
import { initializeProtocolHandlers } from "./protocol";
import { initializeDefaultSession } from "./session";
import { getMainWindow } from "./windows/mainWindow";

registerLogEntryHandler((entry) => {
  logStorage.send(entry);
});

register();
setLogger((msg) => {
  console.info("from unhandled", msg);
});

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

const log = makeLogger("Electron-Boot-Sequence");

function initializeApp() {
  log.info(`Initialize bridge handlers`);
  initializeBridgeHandlers();

  log.info(`Initialize protocol handlers`);
  initializeProtocolHandlers();

  log.info(`Initialize main window`);
  getMainWindow();

  log.info(`Initialize logger`);
  InitializeLogger();

  log.info(`Initialize service sync`);
  initializeServiceSync();

  initializeGlobalShortcuts();

  initializeDefaultSession();

  initializeDarkModeHandling();

  initializeIpcBroadcast();

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
