import { BrowserView, BrowserWindow } from "electron";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { attachViewToPreloadingWindow, getPreloadingWindow } from "./preloadingWindow";
import { assertViewIsNotAttachedToWindow } from "./utils/view";

const log = makeLogger("BrowserView");

export type PreviewAttachManager = ReturnType<typeof attachPreview>;

export function attachPreview(view: BrowserView, targetWindow: BrowserWindow) {
  if (view.webContents.isDestroyed()) {
    console.warn(`Trying to attach destroyed view`);
    return () => void 0;
  }

  getPreloadingWindow().removeBrowserView(view);

  // Should never happen, but make sure to throw early if it does.
  assertViewIsNotAttachedToWindow(view, targetWindow);

  targetWindow.addBrowserView(view);

  targetWindow.getBrowserViews().forEach((otherViwe) => {
    if (otherViwe !== view) {
      targetWindow.setTopBrowserView(otherViwe);
    }
  });

  function detach() {
    log("will detach view");

    targetWindow.removeBrowserView(view);

    attachViewToPreloadingWindow(view);

    return true;
  }

  return detach;
}
