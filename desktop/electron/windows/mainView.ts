import path from "path";

import * as Sentry from "@sentry/electron";
import { BrowserView, BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";

import { AppEnvData } from "@aca/desktop/envData";

import { handleMainViewPosition } from "./utils/mainViewPosition";

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

function loadAppInView(view: BrowserView) {
  return view.webContents.loadURL(
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

export function initializeMainView(mainWindow: BrowserWindow) {
  const env: AppEnvData = {
    appName: app.name,
    sentryDsn,
    isDev: IS_DEV,
    version: app.getVersion(),
    windowName: "Root",
  };

  const mainView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, "preload.js"),
      additionalArguments: [JSON.stringify(env)],
      backgroundThrottling: false,
      devTools: true,
    },
  });

  mainView.setBackgroundColor("#00000000");

  mainWindow.addBrowserView(mainView);

  handleMainViewPosition(mainWindow, mainView);

  mainWindow.setTopBrowserView(mainView);

  loadAppInView(mainView);

  mainView.webContents.on("did-fail-load", () => {
    loadAppInView(mainView);
  });

  return mainView;
}
