import { BrowserView, BrowserWindow } from "electron";

import { appEnvData } from "./env";
import { PRELOAD_SCRIPT_PATH, getEntryHTMLFilePath } from "./paths";
import { handleMainViewPosition } from "./utils/mainViewPosition";
import { setBrowserViewZIndex } from "./viewZIndex";

function loadAppInView(view: BrowserView) {
  return view.webContents.loadURL(getEntryHTMLFilePath("index.html"));
}

const windowMainViewMap = new WeakMap<BrowserWindow, BrowserView>();

export function initializeMainView(mainWindow: BrowserWindow) {
  const mainView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      preload: PRELOAD_SCRIPT_PATH,
      additionalArguments: [JSON.stringify(appEnvData)],
      backgroundThrottling: false,
      devTools: true,
    },
  });

  windowMainViewMap.set(mainWindow, mainView);

  // Make sure mainView is transparent, by itself so it is not guessed from body background
  mainView.setBackgroundColor("#00000000");

  mainWindow.addBrowserView(mainView);

  handleMainViewPosition(mainWindow, mainView);

  setBrowserViewZIndex(mainView, "app");

  loadAppInView(mainView);

  mainView.webContents.on("did-fail-load", () => {
    loadAppInView(mainView);
  });

  mainView.webContents.focus();

  return mainView;
}

export function getWindowMainView(window: BrowserWindow) {
  return windowMainViewMap.get(window) ?? null;
}
