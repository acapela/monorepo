import { BrowserView, BrowserWindow, app } from "electron";

import { PreviewPosition } from "@aca/desktop/domains/preview";
import { appState } from "@aca/desktop/electron/appState";
import { autorunEffect } from "@aca/shared/mobx/utils";

import { assertViewIsAttachedToWindow, getBrowserViewParentWindow } from "./utils/view";

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

export function handleWindowViewsPositioning(window: BrowserWindow) {
  function updateViews() {
    updateWindowViewsPosition(window);
  }

  window.on("resize", updateViews);

  return () => {
    window.off("resize", updateViews);
  };
}

function updateBrowserViewSize(view: BrowserView, window: BrowserWindow, position: PreviewPosition) {
  assertViewIsAttachedToWindow(view, window);

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;

  const [windowWidth, windowHeight] = window.getSize();

  const electronRect = {
    x: left,
    y: top,
    width: windowWidth - left - right,
    height: windowHeight - top - bottom,
  };

  view.setBounds(electronRect);
}

app.whenReady().then(() => {
  autorunEffect(() => {
    const { mainWindow } = appState;

    if (!mainWindow) return;

    return handleWindowViewsPositioning(mainWindow);
  });
});
