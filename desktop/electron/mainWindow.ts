import path from "path";

import * as Sentry from "@sentry/electron";
import { BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";
import { memoize } from "lodash";
import { autorun } from "mobx";

import { AppEnvData } from "@aca/desktop/envData";

import { applicationFocusStateBridge, applicationStateBridge } from "../bridge/system";
import { createBrowserWindowMobxBinding } from "./utils/browserWindowMobxBinding";
import { handleHideWindowOnClose } from "./utils/hideWindowOnClose";
import { makeLinksOpenInDefaultBrowser } from "./utils/openLinks";
import { initializeChildWindowHandlers } from "./windows";

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

function initializeMainWindow() {
  const env: AppEnvData = {
    appName: app.name,
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
      backgroundThrottling: false,
    },
    minWidth: 900,
    minHeight: 680,
    titleBarStyle: "hiddenInset",
    fullscreenable: true,
    vibrancy: "sidebar",
    trafficLightPosition: { x: 19, y: 18 },

    //
  });

  mainWindow.focus();
  // mainWindow.webContents.openDevTools();

  loadAppInWindow(mainWindow).then(() => {
    mainWindow.focus();
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.getBrowserViews().forEach((view) => {
      mainWindow.removeBrowserView(view);
    });
  });

  mainWindow.webContents.on("did-fail-load", () => {
    loadAppInWindow(mainWindow);
  });

  handleHideWindowOnClose(mainWindow);

  initializeChildWindowHandlers(mainWindow);

  makeLinksOpenInDefaultBrowser(mainWindow.webContents);

  return mainWindow;
}

export const getMainWindow = memoize(initializeMainWindow);

export const getMainWindowState = memoize(() => {
  return createBrowserWindowMobxBinding(getMainWindow());
});

app.whenReady().then(() => {
  const mainWindowState = getMainWindowState();

  autorun(() => {
    const { isFocused } = mainWindowState;

    applicationStateBridge.update({ isFocused });

    if (isFocused) {
      applicationFocusStateBridge.update({ lastAppFocusDateTs: Date.now() });
    } else {
      applicationFocusStateBridge.update({ lastAppBlurredDateTs: Date.now() });
    }
  });

  autorun(() => {
    const { isFullscreen } = mainWindowState;

    applicationStateBridge.update({ isFullscreen });
  });
});
