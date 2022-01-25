import "./globals";

import path from "path";

import { BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";
import { autoUpdater } from "electron-updater";

import { ServiceSyncController, initializeServiceSync } from "./apps";
import { initializeBridgeHandlers } from "./bridgeHandlers";
import { initializeProtocolHandlers } from "./protocol";

// Note - please always use 'path' module for paths (especially with slashes) instead of eg `${pathA}/${pathB}` to avoid breaking it on windows.
// Note - do not use relative paths without __dirname
const DIST_PATH = path.resolve(__dirname, "../client");
const INDEX_HTML_FILE = path.resolve(DIST_PATH, "index.html");

// Note - in case we'll use multiple windows, create some solid abstraction on setting and unsetting open windows.
// Reference to main, opened window
let mainWindow: BrowserWindow | null;

// This allows the sync utilities to react depending on the state of the windows
let serviceSyncController: ServiceSyncController | null;

export function getMainWindow() {
  return mainWindow;
}

function initializeMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    title: "Acapela",
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, "preload.js"),
    },
    titleBarStyle: "hidden",

    fullscreenable: false,
    // TODO: Seems not to work in dev mode
    icon: path.resolve(__dirname, "../../assets/app-icon.png"),
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    IS_DEV
      ? // In dev mode - load from local dev server
        "http://localhost:3005"
      : // In production - load static, bundled file
        `file://${INDEX_HTML_FILE}`
  );

  autoUpdater.checkForUpdatesAndNotify();

  mainWindow.on("closed", () => {
    mainWindow = null;
    //
  });

  mainWindow.on("focus", () => {
    serviceSyncController?.onWindowFocus();
  });

  mainWindow.on("blur", () => {
    serviceSyncController?.onWindowBlur();
  });
}

function initializeApp() {
  console.info(`Initialize bridge handlers`);
  initializeBridgeHandlers();

  console.info(`Initialize protocol handlers`);
  initializeProtocolHandlers();

  console.info(`Initialize main window`);
  initializeMainWindow();

  console.info(`Initialize main window`);
  serviceSyncController = initializeServiceSync();
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
  if (mainWindow === null) {
    initializeMainWindow();
  }
});
