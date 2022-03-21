import { BrowserWindow } from "electron";

import { getWindowMainView } from "./mainView";

export function focusWindowWebContents(window: BrowserWindow) {
  const mainView = getWindowMainView(window);

  if (mainView) {
    mainView.webContents.focus();
    return;
  }

  window.webContents.focus();
}
