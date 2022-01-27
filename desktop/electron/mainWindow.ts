import path from "path";

import { BrowserWindow } from "electron";
import IS_DEV from "electron-is-dev";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

import { appState } from "./appState";

// Note - please always use 'path' module for paths (especially with slashes) instead of eg `${pathA}/${pathB}` to avoid breaking it on windows.
// Note - do not use relative paths without __dirname
const DIST_PATH = path.resolve(__dirname, "../client");
const INDEX_HTML_FILE = path.resolve(DIST_PATH, "index.html");

export function initializeMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    title: "Acapela",
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, "preload.js"),
    },
    titleBarStyle: "hidden",

    fullscreenable: false,
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    IS_DEV
      ? // In dev mode - load from local dev server
        "http://localhost:3005"
      : // In production - load static, bundled file
        `file://${INDEX_HTML_FILE}`
  );

  log.transports.file.level = "info";
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();

  appState.mainWindow = mainWindow;

  mainWindow.on("closed", () => {
    appState.mainWindow = null;
  });

  mainWindow.maximize();
  mainWindow.webContents.toggleDevTools();

  return mainWindow;
}
