import * as Sentry from "@sentry/electron";
import { BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";
import { memoize } from "lodash";
import { autorun } from "mobx";

import { applicationFocusStateBridge, applicationStateBridge } from "../../bridge/system";
import { initializeChildWindowHandlers } from "./childWindows";
import { initializeMainView } from "./mainView";
import { initializeOverlayView } from "./overlayView";
import { sentryDsn } from "./paths";
import { createBrowserWindowMobxBinding } from "./utils/browserWindowMobxBinding";
import { handleHideWindowOnClose } from "./utils/hideWindowOnClose";
import { makeLinksOpenInDefaultBrowser } from "./utils/openLinks";

if (!IS_DEV) {
  Sentry.init({
    dsn: sentryDsn,
    release: app.getVersion(),
  });
}

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

  const overlayView = initializeOverlayView(mainWindow, mainView);

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
