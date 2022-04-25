import * as Sentry from "@sentry/electron";
import { BrowserWindow, app, nativeTheme } from "electron";
import IS_DEV from "electron-is-dev";
import { memoize } from "lodash";
import { autorun } from "mobx";

import { applicationFocusStateBridge, applicationStateBridge } from "../../bridge/system";
import { handleWindowViewsPositioning } from "../bridgeHandlers/previews/position";
import { initializeChildWindowHandlers } from "./childWindows";
import { appEnvData } from "./env";
import { initializeMainView } from "./mainView";
import { initializeOverlayView } from "./overlayView";
import { createBrowserWindowMobxBinding } from "./utils/browserWindowMobxBinding";
import { handleHideWindowOnClose } from "./utils/hideWindowOnClose";
import { makeLinksOpenInDefaultBrowser } from "./utils/openLinks";

if (!IS_DEV) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: app.getVersion(),
    environment: process.env.STAGE,
    maxValueLength: 10000,
  });
}

function getAppWindowSize(): { width: number; height: number } {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  return {
    width: Math.round(width * 0.85),
    height: Math.round(height * 0.9),
  };
}

function initializeMainWindow() {
  const { width, height } = getAppWindowSize();

  const mainWindow = new BrowserWindow({
    width,
    height,
    title: "Acapela",
    minWidth: 900,
    minHeight: 680,
    titleBarStyle: "hiddenInset",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#1C1C1C" : "#ffffff",
    fullscreenable: true,
    trafficLightPosition: { x: 19, y: 18 },
    webPreferences: {
      devTools: false,
    },
  });

  const mainView = initializeMainView(mainWindow, appEnvData.get());

  const overlayView = initializeOverlayView(mainWindow, mainView, appEnvData.get());

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

  initializeMainWindowBridge(mainWindow);

  handleWindowViewsPositioning(mainWindow);

  return { mainWindow, mainView, overlayView };
}

const initializeMainWindowOnce = memoize(initializeMainWindow);

export const getMainWindow = () => initializeMainWindowOnce().mainWindow;
export const getMainView = () => initializeMainWindowOnce().mainView;
export const getOverlayView = () => initializeMainWindowOnce().overlayView;

export function focusMainView() {
  getMainView().webContents.focus();
}

export const getMainWindowState = memoize(() => {
  return createBrowserWindowMobxBinding(getMainWindow());
});

function initializeMainWindowBridge(mainWindow: BrowserWindow) {
  const mainWindowState = createBrowserWindowMobxBinding(mainWindow);
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
}
