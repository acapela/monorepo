import { appState } from "@aca/desktop/electron/appState";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { Point } from "@aca/shared/point";
import { BrowserView, BrowserWindow } from "electron";
import { memoize } from "lodash";
import { autorun } from "mobx";

import { expectedPreviewPosition } from "./position";
import { updateBrowserViewSize } from "./previewAttaching";

/**
 * In order to make preloading 'effective' (aka show-up), a few things have to happen:
 *
 * - we need http request to happen
 * - view must be somewhat visible and have some non zero size (!)
 * - size should be equal to how it will look when it'll become visible to avoid flicker
 *
 * To do that, we're creating 'kinda-hidden' window, that will follow the size of main window
 * and follow views size as well. Then, when main window requests to show previews we move them.
 */

/**
 * Some utils for size tracking / mirroring, etc
 */
function getWindowSize(window?: BrowserWindow): Point | null {
  const size = window?.getSize();

  if (!size) return null;

  const [x, y] = size;

  return { x, y };
}

function syncWindowsSizeOnce(sourceWindow: BrowserWindow, targetWindow: BrowserWindow) {
  const [width, height] = sourceWindow.getSize();

  targetWindow.setSize(width, height, false);
}

function mirrorWindowSize(sourceWindow: BrowserWindow, targetWindow: BrowserWindow) {
  function sync() {
    syncWindowsSizeOnce(sourceWindow, targetWindow);
  }

  sync();

  sourceWindow.on("resized", sync);

  return () => {
    sourceWindow.off("resized", sync);
  };
}

export const getPreloadingWindow = memoize(() => {
  const mainWindowSize = getWindowSize(appState.mainWindow ?? undefined);

  const preloadingWindow = new BrowserWindow({
    opacity: 0,
    transparent: false,
    alwaysOnTop: true,
    focusable: false,
    width: mainWindowSize?.x ?? 900,
    height: mainWindowSize?.y ?? 900,
    x: 1,
    y: 1,
  });

  // We don't want this window to interfere with user actions in any way
  preloadingWindow.setIgnoreMouseEvents(true);

  // Always mirror main window size
  autorunEffect(() => {
    const { mainWindow } = appState;

    if (!mainWindow) return;

    return mirrorWindowSize(mainWindow, preloadingWindow);
  });

  // On any resize of window (caused by mirroring main window - update all views instantly)

  autorun(() => {
    // We're running in mobx effect, as we're reading from expectedPreviewPosition which might change
    // If that happens, we also want to update views size to be exactly the same as main window might require
    preparePositionForAllViews();
  });

  function preparePositionForAllViews() {
    const expectedPosition = expectedPreviewPosition.get();

    preloadingWindow.getBrowserViews().forEach((view) => {
      updateBrowserViewSize(view, preloadingWindow, expectedPosition);
    });
  }

  preloadingWindow.on("resize", () => preparePositionForAllViews());

  return preloadingWindow;
});

export function attachViewToPreloadingWindow(view: BrowserView) {
  const preloadingWindow = getPreloadingWindow();

  preloadingWindow.addBrowserView(view);
  updateBrowserViewSize(view, preloadingWindow, expectedPreviewPosition.get());
}
