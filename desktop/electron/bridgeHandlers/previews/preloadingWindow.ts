import { BrowserView, BrowserWindow } from "electron";
import { memoize } from "lodash";

import { PreviewPosition } from "@aca/desktop/domains/preview";
import { Point } from "@aca/shared/point";

import { appAndEnvReadyPromise } from "../../windows/env";
import { getMainWindow } from "../../windows/mainWindow";
import { DEFAULT_EXPECTED_PREVIEW_POSITION, handleWindowViewsPositioning, setViewPosition } from "./position";
import { mirrorWindowSize } from "./utils/mirrorWindowSize";

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

export const getPreloadingWindow = memoize(() => {
  const mainWindow = getMainWindow();
  const mainWindowSize = getWindowSize(mainWindow);

  const preloadingWindow = new BrowserWindow({
    opacity: 0,
    transparent: false,
    alwaysOnTop: true,
    focusable: false,
    width: mainWindowSize?.x ?? 900,
    height: mainWindowSize?.y ?? 900,
    x: 1,
    y: 1,
    title: "",

    // if set to false, it prevents acapela from closing
    // closable: false,
    kiosk: false,
  });

  // We don't want this window to interfere with user actions in any way
  preloadingWindow.setIgnoreMouseEvents(true);

  mirrorWindowSize(mainWindow, preloadingWindow);

  handleWindowViewsPositioning(preloadingWindow);

  return preloadingWindow;
});

export function attachViewToPreloadingWindow(
  view: BrowserView,
  position: PreviewPosition = DEFAULT_EXPECTED_PREVIEW_POSITION
) {
  const preloadingWindow = getPreloadingWindow();

  preloadingWindow.addBrowserView(view);

  setViewPosition(view, position);
}

/**
 * Lets initialize preloading window as soon as possible (so we dont wait for React to request it)
 */
appAndEnvReadyPromise.then(() => {
  // getPreloadingWindow();
});
