import path from "path";

import * as Sentry from "@sentry/electron";
import { BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";
import { memoize } from "lodash";
import { autorun } from "mobx";

import { applicationFocusStateBridge, applicationStateBridge } from "../../bridge/system";
import { initializeChildWindowHandlers } from "./childWindows";
import { initializeMainView } from "./mainView";
import { createBrowserWindowMobxBinding } from "./utils/browserWindowMobxBinding";
import { handleHideWindowOnClose } from "./utils/hideWindowOnClose";
import { makeLinksOpenInDefaultBrowser } from "./utils/openLinks";

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

export const acapelaAppPathUrl = IS_DEV
  ? // In dev mode - load from local dev server
    "http://localhost:3005/"
  : // In production - load static, bundled file
    `file://${INDEX_HTML_FILE}`;

function initializeMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    title: "Acapela",
    minWidth: 900,
    minHeight: 680,
    titleBarStyle: "hiddenInset",
    fullscreenable: true,
    vibrancy: "sidebar",
    trafficLightPosition: { x: 19, y: 18 },
    webPreferences: {
      devTools: false,
    },
    //
  });

  const mainView = initializeMainView(mainWindow);

  const mainWindowWebContents = mainWindow.webContents;

  Reflect.set(mainWindow, "webContents", {
    get() {
      console.warn(
        `Reading .webContents from main window. We're not using main window webcontents. Use getWindowMainView(mainWindow).webContents instead`
      );

      return mainWindowWebContents;
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.getBrowserViews().forEach((view) => {
      mainWindow.removeBrowserView(view);
    });
  });

  handleHideWindowOnClose(mainWindow);

  initializeChildWindowHandlers(mainView.webContents);

  makeLinksOpenInDefaultBrowser(mainWindow.webContents);

  return { mainWindow, mainView };
}

const initializeMainWindowOnce = memoize(initializeMainWindow);

export const getMainWindow = () => initializeMainWindowOnce().mainWindow;
export const getMainView = () => initializeMainWindowOnce().mainView;

export function focusMainView() {
  getMainView().webContents.focus();
}

export const getMainWindowState = memoize(() => {
  return createBrowserWindowMobxBinding(getMainWindow(), getMainView());
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
