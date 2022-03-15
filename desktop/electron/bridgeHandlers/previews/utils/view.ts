import { BrowserView, BrowserWindow } from "electron";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

const log = makeLogger("BrowserView");

export function getIsViewAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  return window.getBrowserViews().includes(view);
}

export function assertViewIsNotAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  log.assert(!getIsViewAttachedToWindow(view, window), "Requested view is already attached to the window");
}

export function assertViewIsAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  log.assert(getIsViewAttachedToWindow(view, window), "Requested view is already attached to the window");
}

export function getBrowserViewParentWindow(view: BrowserView) {
  return (
    BrowserWindow.getAllWindows().find((window) => {
      return getIsViewAttachedToWindow(view, window);
    }) ?? null
  );
}
