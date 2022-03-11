import { PreviewPosition } from "@aca/desktop/domains/preview";
import { BrowserView, BrowserWindow } from "electron";
import { isEqual } from "lodash";
import { autorun, observable } from "mobx";

import { assertViewIsAttachedToWindow } from "./utils";

/**
 * Before first view is requested (aka Focus mode opened) we need to 'estimate' position of view
 * We know how our UI look, so this value should match.
 *
 * Note: If we change UI - we need to update this item, to avoid flicker of first 'focus mode open'
 */
export const DEFAULT_EXPECTED_PREVIEW_POSITION: PreviewPosition = { top: 52, left: 0, bottom: 38, right: 0 };

export const expectedPreviewPosition = observable.box<PreviewPosition>(DEFAULT_EXPECTED_PREVIEW_POSITION, {
  equals: isEqual,
});

export function keepBrowserViewPositionUpToDate(view: BrowserView, targetWindow: BrowserWindow) {
  function updateViewPositionAndSize() {
    updateBrowserViewSize(view, targetWindow, expectedPreviewPosition.get());
  }

  targetWindow.on("resize", updateViewPositionAndSize);

  const cancelAuto = autorun(() => {
    updateBrowserViewSize(view, targetWindow, expectedPreviewPosition.get());
  });

  function stop() {
    targetWindow.off("resize", updateViewPositionAndSize);

    cancelAuto();
  }

  return stop;
}

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
