import "./globals";

import { app, protocol } from "electron";
import IS_DEV from "electron-is-dev";

import { initializeServiceSync } from "./apps";
import { appState } from "./appState";
import { initializeBridgeHandlers } from "./bridgeHandlers";
import { initializeMainWindow } from "./mainWindow";
import { initializeProtocolHandlers } from "./protocol";
import { initializeSingleInstanceLock } from "./singleInstance";

protocol.registerSchemesAsPrivileged([{ scheme: IS_DEV ? "http" : "file", privileges: { secure: true } }]);

// Has to be done before app ready
initializeSingleInstanceLock();

function initializeApp() {
  console.info(`Initialize bridge handlers`);
  initializeBridgeHandlers();

  console.info(`Initialize protocol handlers`);
  initializeProtocolHandlers();

  console.info(`Initialize main window`);
  appState.mainWindow = initializeMainWindow();

  console.info(`Initialize main window`);
  initializeServiceSync();
}

app.on("ready", initializeApp);

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
    appState.mainWindow = initializeMainWindow();
  }
});
