import { BrowserView, BrowserWindow } from "electron";

import { PreviewPosition } from "@aca/desktop/domains/preview";

import { evaluateFunctionInWebContents } from "../../utils/webContentsLink";
import { getWindowMainView } from "../../windows/mainView";
import { assertViewIsAttachedToWindow, getBrowserViewParentWindow } from "../../windows/viewUtils";

/**
 * Flow:
 *
 * Each view can have some 'desired position' set in viewPositionMap
 *
 * Each window on resize is iterating over its views, checking if they have some desired position and updates properly
 */

/**
 * When preloading only (before attaching preview) we need to give it 'some' dimensions.
 *
 * We want to avoid 'resize ui flicker' when attaching to actual window, so we 'guess' initial position.
 *
 * This object should match our current 'ui version' of preview position in the app
 *
 * TODO: Warn when default position turns out to never be used
 */
export const DEFAULT_EXPECTED_PREVIEW_POSITION: PreviewPosition = { top: 52, left: 0, bottom: 38, right: 0 };

const viewPositionMap = new WeakMap<BrowserView, PreviewPosition>();

export function updateWindowViewsPosition(window: BrowserWindow) {
  window.getBrowserViews().forEach((view) => {
    const position = viewPositionMap.get(view);

    if (!position) return;

    updateBrowserViewSize(view, window, position);
  });
}

export function setViewPosition(view: BrowserView, position: PreviewPosition) {
  viewPositionMap.set(view, position);

  const window = getBrowserViewParentWindow(view);

  if (!window) return;

  updateBrowserViewSize(view, window, position);
}

export function handleWindowViewsPositioning(browserWindow: BrowserWindow) {
  function updateViews() {
    updateWindowViewsPosition(browserWindow);
  }

  browserWindow.on("resize", updateViews);

  const mainViewWebContents = getWindowMainView(browserWindow)?.webContents ?? browserWindow.webContents;

  mainViewWebContents.on("devtools-opened", updateViews);
  mainViewWebContents.on("devtools-closed", updateViews);

  return () => {
    browserWindow.off("resize", updateViews);
    mainViewWebContents.off("devtools-opened", updateViews);
    mainViewWebContents.off("devtools-closed", updateViews);
  };
}

async function getWindowClientBounds(browserWindow: BrowserWindow): Promise<{ width: number; height: number }> {
  const mainViewWebContents = getWindowMainView(browserWindow)?.webContents;

  const webContents = mainViewWebContents ?? browserWindow.webContents;

  if (!webContents.isDevToolsOpened()) {
    return browserWindow.getBounds();
  }

  const { width, height } = await evaluateFunctionInWebContents(webContents, () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  return { width, height };
}

async function updateBrowserViewSize(view: BrowserView, window: BrowserWindow, position: PreviewPosition) {
  assertViewIsAttachedToWindow(view, window);

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;

  const { width, height } = await getWindowClientBounds(window);

  const electronRect = {
    x: left,
    y: top,
    width: width - left - right,
    height: height - top - bottom,
  };

  view.setBounds(electronRect);
}
