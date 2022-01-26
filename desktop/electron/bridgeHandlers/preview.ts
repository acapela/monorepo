import { BrowserView, BrowserWindow, Rectangle } from "electron";

import { requestPreloadInMainWindow, requestPreviewInMainWindow } from "@aca/desktop/bridge/preview";

import { getMainWindow } from "..";

const preloads = new Map<string, BrowserView>();

const PRVIEW_SIDEBAR_OFFSET = 300;

function calculatePreviewBounds(targetWindow: BrowserWindow): Rectangle {
  const { width, height } = targetWindow.getBounds();

  return {
    height,
    width: width - PRVIEW_SIDEBAR_OFFSET,
    y: 0,
    x: PRVIEW_SIDEBAR_OFFSET,
  };
}

const replaceArchiveWithMessages = (url: string) => url.replace("/archives/", "/messages/");

export function initPreviewHandler() {
  requestPreloadInMainWindow.handle(async ({ url }) => {
    url = replaceArchiveWithMessages(url);
    console.info("preloading", url);
    if (!preloads.has(url)) {
      const browserView = new BrowserView();
      preloads.set(url, browserView);
      await browserView.webContents.loadURL(url);
    }
    return true;
  });

  requestPreviewInMainWindow.handle(async ({ url }) => {
    url = replaceArchiveWithMessages(url);
    const mainWindow = getMainWindow();

    if (!mainWindow) return false;

    const currentViews = mainWindow.getBrowserViews();

    currentViews.forEach((view) => {
      mainWindow.removeBrowserView(view);
    });

    let browserView = preloads.get(url);
    if (!browserView) {
      browserView = new BrowserView();
      await browserView.webContents.loadURL(url);
    }
    mainWindow.setBrowserView(browserView);
    browserView.setBounds(calculatePreviewBounds(mainWindow));

    return true;
  });
}
