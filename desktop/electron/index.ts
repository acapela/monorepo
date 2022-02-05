import "@aca/desktop/lib/env"; // import for side effects

import "./globals";

import { app, protocol } from "electron";
import IS_DEV from "electron-is-dev";
import { action } from "mobx";

import { InitializeLogger, makeLogger } from "../domains/dev/logger";
import { initializeServiceSync } from "./apps";
import { appState } from "./appState";
import { initializeBridgeHandlers } from "./bridgeHandlers";
import { initializeGlobalShortcuts } from "./globalShortcuts";
import { initializeMainWindow } from "./mainWindow";
import { initializeProtocolHandlers } from "./protocol";
import { initializeSingleInstanceLock } from "./singleInstance";

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

  log.info(`Initialize main window`);
  InitializeLogger();

  log.info(`Initialize main window`);
  initializeServiceSync();

  initializeGlobalShortcuts();
}

app.on("ready", action(initializeApp));

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
