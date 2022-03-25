import { BrowserView, BrowserWindow } from "electron";

import { evaluateFunctionInWebContents } from "../utils/webContentsLink";
import { appEnvData } from "./env";
import { handleOverlayViewPosition } from "./overlayUtils/overlayViewPosition";
import { PRELOAD_SCRIPT_PATH, getEntryHTMLFilePath } from "./paths";
import { setBrowserViewZIndex } from "./viewZIndex";

const windowMainViewMap = new WeakMap<BrowserWindow, BrowserView>();

export function initializeOverlayView(mainWindow: BrowserWindow, mainView: BrowserView) {
  const overlayView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      preload: PRELOAD_SCRIPT_PATH,
      additionalArguments: [JSON.stringify(appEnvData)],
      backgroundThrottling: false,
      devTools: true,
    },
  });

  overlayView.webContents.on("console-message", (event, level, message, line, sourceId) => {
    evaluateFunctionInWebContents(
      mainView.webContents,
      (message: string, level: number, line: number, sourceId: string) => {
        console.info(`[Overlay window]`, JSON.stringify(message), level, `${sourceId}:${line}`);
      },
      message,
      level,
      line,
      sourceId
    );
  });

  windowMainViewMap.set(mainWindow, overlayView);

  // Make sure mainView is transparent, by itself so it is not guessed from body background
  overlayView.setBackgroundColor("#00000000");

  mainWindow.addBrowserView(overlayView);

  handleOverlayViewPosition(mainWindow, overlayView);

  setBrowserViewZIndex(overlayView, "overlay");

  overlayView.webContents.loadURL(getEntryHTMLFilePath("overlay.html"));

  return overlayView;
}
