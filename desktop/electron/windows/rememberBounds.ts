import { BrowserWindow } from "electron";

import { MainWindowLastBounds, electronSettingsBridge } from "@aca/desktop/bridge/system";

function getCurrentBounds(window: BrowserWindow): MainWindowLastBounds {
  const bounds = window.getBounds();
  const isMaximized = window.isMaximized();

  return { bounds, isMaximized };
}

export function initializeMainWindowRememberBounds(window: BrowserWindow) {
  function saveBounds() {
    const boundsInfo = getCurrentBounds(window);
    electronSettingsBridge.update({ lastMainWindowBounds: boundsInfo });
  }

  window.on("resized", saveBounds);
  window.on("moved", saveBounds);

  return () => {
    window.off("resized", saveBounds);
    window.off("moved", saveBounds);
  };
}

function applyLastBoundsToWindow(boundsInfo: MainWindowLastBounds, window: BrowserWindow) {
  if (boundsInfo.isMaximized) {
    window.maximize();
    return;
  }

  window.setBounds(boundsInfo.bounds);
}

export function restoreLastMainWindowBounds(window: BrowserWindow) {
  const lastBounds = electronSettingsBridge.get().lastMainWindowBounds;

  if (!lastBounds) return;

  applyLastBoundsToWindow(lastBounds, window);
}
