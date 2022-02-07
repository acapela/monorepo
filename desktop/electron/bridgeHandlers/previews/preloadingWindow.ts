import { BrowserView, BrowserWindow } from "electron";
import { isEqual, memoize } from "lodash";
import { autorun, observable } from "mobx";

import { PreviewPosition } from "@aca/desktop/domains/preview";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { Point } from "@aca/shared/point";

import { appState } from "../../appState";
import { updateBrowserViewSize } from "./previewAttaching";

function getWindowSize(window?: BrowserWindow): Point | null {
  const size = window?.getSize();

  if (!size) return null;

  const [x, y] = size;

  return { x, y };
}

function syncWindowsSize(sourceWindow: BrowserWindow, targetWindow: BrowserWindow) {
  const [width, height] = sourceWindow.getSize();

  targetWindow.setSize(width, height, false);
}

function mirrorWindowSize(sourceWindow: BrowserWindow, targetWindow: BrowserWindow) {
  function update() {
    syncWindowsSize(sourceWindow, targetWindow);
  }

  update();

  sourceWindow.on("resized", update);

  return () => {
    sourceWindow.off("resized", update);
  };
}

export const getPreloadingWindow = memoize(() => {
  const mainWindowSize = getWindowSize(appState.mainWindow ?? undefined);

  const window = new BrowserWindow({
    opacity: 0,
    transparent: false,
    alwaysOnTop: true,
    focusable: false,
    width: mainWindowSize?.x ?? 900,
    height: mainWindowSize?.y ?? 900,
    x: 1,
    y: 1,
  });

  window.setIgnoreMouseEvents(true);

  autorunEffect(() => {
    const { mainWindow } = appState;

    if (!mainWindow) return;

    return mirrorWindowSize(mainWindow, window);
  });

  function updateAllViews() {
    const expectedPosition = expectedPreviewPosition.get();

    window.getBrowserViews().forEach((view) => {
      updateBrowserViewSize(view, window, expectedPosition);
    });
  }

  window.on("resize", () => updateAllViews());

  autorun(() => {
    updateAllViews();
  });

  return window;
});

export const DEFAULT_EXPECTED_PREVIEW_POSITION: PreviewPosition = { top: 138, left: 72, bottom: 38, right: 0 };

export const expectedPreviewPosition = observable.box<PreviewPosition>(DEFAULT_EXPECTED_PREVIEW_POSITION, {
  equals: isEqual,
});

export function attachViewToPreloadingWindow(view: BrowserView) {
  const preloadingWindow = getPreloadingWindow();

  preloadingWindow.addBrowserView(view);
  updateBrowserViewSize(view, preloadingWindow, expectedPreviewPosition.get());
}
