import { BrowserView, BrowserWindow, Rectangle, app } from "electron";

import { requestPreviewInMainWindow } from "@aca/desktop/bridge/preview";

import { getMainWindow } from "..";

let figma1View: BrowserView;
let figma2View: BrowserView;

app.whenReady().then(() => {
  figma1View = new BrowserView();
  figma1View.webContents.loadURL("https://www.figma.com/file/RNAVEjUjOLJyBSsQAD6p15?node-id=1:2#141833024");

  figma2View = new BrowserView();
  figma2View.webContents.loadURL("https://www.figma.com/file/Ooi5lGXE9hhU3bDET4QuCC/Demo-2?node-id=0%3A1");
});

const PRVIEW_SIDEBAR_OFFSET = 50;

function calculatePreviewBounds(targetWindow: BrowserWindow): Rectangle {
  const { width, height } = targetWindow.getBounds();

  return {
    height,
    width: width - PRVIEW_SIDEBAR_OFFSET,
    y: 0,
    x: PRVIEW_SIDEBAR_OFFSET,
  };
}

let currentBrowserView: BrowserView | null;

export function initPreviewHandler() {
  requestPreviewInMainWindow.handle(async (data) => {
    const mainWindow = getMainWindow();

    if (!mainWindow) return false;

    const currentViews = mainWindow.getBrowserViews();

    currentViews.forEach((view) => {
      mainWindow.removeBrowserView(view);
    });

    if (currentBrowserView) {
      mainWindow;
    }

    const id = data.id;

    if (id === 1) {
      mainWindow?.setBrowserView(figma1View);

      figma1View.setBounds(calculatePreviewBounds(mainWindow));
    }

    if (id === 2) {
      mainWindow?.setBrowserView(figma2View);
      figma2View.setBounds(calculatePreviewBounds(mainWindow));
    }

    return true;
  });
}
