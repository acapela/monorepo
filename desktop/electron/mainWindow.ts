import path from "path";

import * as Sentry from "@sentry/electron";
import { BrowserWindow, Menu, MenuItemConstructorOptions, app } from "electron";
import IS_DEV from "electron-is-dev";
import { action, runInAction } from "mobx";

import { AppEnvData } from "@aca/desktop/envData";

import { appState } from "./appState";

// Note - please always use 'path' module for paths (especially with slashes) instead of eg `${pathA}/${pathB}` to avoid breaking it on windows.
// Note - do not use relative paths without __dirname
const DIST_PATH = path.resolve(__dirname, "../client");
const INDEX_HTML_FILE = path.resolve(DIST_PATH, "index.html");
export const PRELOAD_SCRIPT_PATH = path.resolve(__dirname, "preload.js");
export const sentryDsn = "https://ed39ac35046641e988dcea60c3bab87b@o485543.ingest.sentry.io/6170771";

if (!IS_DEV) {
  Sentry.init({
    dsn: sentryDsn,
    release: app.getVersion(),
  });
}

function loadAppInWindow(window: BrowserWindow) {
  return window.loadURL(
    IS_DEV
      ? // In dev mode - load from local dev server
        "http://localhost:3005"
      : // In production - load static, bundled file
        `file://${INDEX_HTML_FILE}`
  );
}

export const acapelaAppPathUrl = IS_DEV
  ? // In dev mode - load from local dev server
    "http://localhost:3005/"
  : // In production - load static, bundled file
    `file://${INDEX_HTML_FILE}`;

export function initializeMainWindow() {
  const env: AppEnvData = {
    sentryDsn,
    isDev: IS_DEV,
    version: app.getVersion(),
    windowName: "Root",
  };

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    title: "Acapela",
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, "preload.js"),
      additionalArguments: [JSON.stringify(env)],
    },
    minWidth: 900,
    minHeight: 680,
    titleBarStyle: "hiddenInset",
    fullscreenable: true,
  });

  addCustomMenu();

  mainWindow.focus();
  // mainWindow.webContents.openDevTools();

  loadAppInWindow(mainWindow).then(() => {
    mainWindow.focus();
  });

  runInAction(() => {
    appState.mainWindow = mainWindow;
  });

  mainWindow.on(
    "closed",
    action(() => {
      appState.mainWindow = null;
    })
  );

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.getBrowserViews().forEach((view) => {
      mainWindow.removeBrowserView(view);
    });
  });

  mainWindow.webContents.on("did-fail-load", () => {
    loadAppInWindow(mainWindow);
  });

  return mainWindow;
}

function addCustomMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },

    {
      label: "Debug",
      submenu: [{ role: "reload" }, { role: "forceReload" }, { role: "toggleDevTools" }],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
