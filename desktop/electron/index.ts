import "@aca/desktop/lib/env"; // import for side effects

import "./globals";

import * as Sentry from "@sentry/electron";
import { app, protocol } from "electron";
import IS_DEV from "electron-is-dev";
import { runInAction } from "mobx";
import { register, setLogger } from "trace-unhandled";

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
import { appEnvData } from "./windows/env";
import { getMainWindow } from "./windows/mainWindow";

// Mark default scheme as secure, thus allowing us to make credentialed requests for secure sites
protocol.registerSchemesAsPrivileged([{ scheme: IS_DEV ? "http" : "file", privileges: { secure: true } }]);

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

const log = makeLogger("Electron-Boot-Sequence");

async function initializeApp() {
  await appEnvData.promise;

  initializeDarkModeHandling();

  log.info(`Initialize bridge handlers`);
  initializeBridgeHandlers();

  log.info(`Initialize protocol handlers`);
  initializeProtocolHandlers();

  log.info(`Initialize main window`);
  getMainWindow();

  log.info(`Initialize service sync`);
  initializeServiceSync();

  initializeGlobalShortcuts();

  initializeDefaultSession();

  initializeIpcBroadcast();

  setupAutoUpdater();
}

log.info(`Waiting for app ready`);

app.whenReady().then(() => {
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
