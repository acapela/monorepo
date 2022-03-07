import { BrowserView, BrowserWindow } from "electron";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { PreviewPosition } from "@aca/desktop/domains/preview";

import { expectedPreviewPosition } from "./preloadingWindow";

const log = makeLogger("BrowserView");

/**
 * Will attach preview to given window at given initial position.
 *
 * Returns function that will detach it.
 *
 * Also handles parent window resizing and properly adjusting view position and size.
 */
export function attachBrowserViewToWindow(
  view: BrowserView,
  targetWindow: BrowserWindow,
  initialPosition: PreviewPosition
) {
  // Request preload in case it was not requested before
  let currentPosition = initialPosition;
  // Should never happen, but make sure to throw early if it does.
  assertViewIsNotAttachedToWindow(view, targetWindow);
  //
  targetWindow.addBrowserView(view);

  expectedPreviewPosition.set(initialPosition);

  function updateViewPositionAndSize() {
    updateBrowserViewSize(view, targetWindow, currentPosition);
  }

  function updatePosition(position: PreviewPosition) {
    expectedPreviewPosition.set(initialPosition);
    currentPosition = position;
    updateViewPositionAndSize();
  }

  updateViewPositionAndSize();

  /**
   * Note!: we're handling resizing electron-size, this provides way smoother experience.
   * We can do that because instead of exact size, we keep 'requested distance to each edge of the window'.
   * In a way this is equal information in this context, as each can be derived from other, but with 2nd one we can do everything
   * electron side.
   */
  targetWindow.on("resize", updateViewPositionAndSize);

  function detach() {
    assertViewIsAttachedToWindow(view, targetWindow);
    log("will detach view");

    targetWindow.off("resize", updateViewPositionAndSize);
    targetWindow.removeBrowserView(view);
    // getPreloadingWindow().addBrowserView(view);

    return true;
  }

  function focus() {
    view.webContents.focus();
  }

  return {
    focus,
    detach,
    updatePosition,
    window: targetWindow,
  };
}

export type PreviewAttachManager = ReturnType<typeof attachBrowserViewToWindow>;

export function updateBrowserViewSize(view: BrowserView, window: BrowserWindow, position: PreviewPosition) {
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

function getIsViewAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  return window.getBrowserViews().includes(view);
}

function assertViewIsNotAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  log.assert(!getIsViewAttachedToWindow(view, window), "Requested view is already attached to the window");
}

function assertViewIsAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  log.assert(getIsViewAttachedToWindow(view, window), "Requested view is already attached to the window");
}
