import { BrowserView, BrowserWindow } from "electron";

import { PreviewPosition } from "@aca/desktop/domains/preview";
import { assert } from "@aca/shared/assert";
import { createLogger } from "@aca/shared/log";

const log = createLogger("BrowserView");

/**
 * Requests preview for given url to be loaded.
 *
 * Will initialize new view if one is not present, or will re-use existing one.
 *
 * Returns function to stop requesting and inform 'url preview is not needed anymore'.
 *
 * If every request is stopped, view will be scheduled to be destroyed.
 *
 * Returns preview state object and function to stop requesting.
 *
 * Note: it is possible that multiple places will request the same url to be 'warm'
 */

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

  function updateViewPositionAndSize() {
    updateBrowserViewSize(view, targetWindow, currentPosition);
  }

  function updatePosition(position: PreviewPosition) {
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

    console.log("A");
    targetWindow.off("resize", updateViewPositionAndSize);
    console.log("C");
    targetWindow.removeBrowserView(view);
    console.log("B");

    return true;
  }

  function focus() {
    console.log("FOCIS REQ");
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

function getIsViewAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  return window.getBrowserViews().includes(view);
}

function assertViewIsNotAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  assert(!getIsViewAttachedToWindow(view, window), "Requested view is already attached to the window");
}

function assertViewIsAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  assert(getIsViewAttachedToWindow(view, window), "Requested view is already attached to the window");
}
