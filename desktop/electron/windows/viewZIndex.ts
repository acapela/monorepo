import { BrowserView, BrowserWindow } from "electron";
import { sortBy } from "lodash";

import { getBrowserViewParentWindow } from "./viewUtils";

const viewsZIndexMap = new WeakMap<BrowserView, number>();

export enum viewsKnownZIndex {
  belowApp = 1,
  app = 2,
  aboveApp = 3,
  overlay = 4,
}

type ZIndexOrName = number | keyof typeof viewsKnownZIndex;

function resolveZIndexOrName(zIndexOrName: ZIndexOrName) {
  return typeof zIndexOrName === "number" ? zIndexOrName : viewsKnownZIndex[zIndexOrName];
}

export function setBrowserViewZIndex(view: BrowserView, zIndexOrName: ZIndexOrName) {
  const zIndex = resolveZIndexOrName(zIndexOrName);
  viewsZIndexMap.set(view, zIndex);
  const parentWindow = getBrowserViewParentWindow(view);

  if (parentWindow) {
    updateWindowViewsZIndex(parentWindow);
  }
}

export function addBrowserViewWithZIndex(window: BrowserWindow, view: BrowserView, zIndex: ZIndexOrName) {
  window.addBrowserView(view);
  setBrowserViewZIndex(view, zIndex);
}

export function updateWindowViewsZIndex(window: BrowserWindow) {
  const viewsWithZIndex = window.getBrowserViews().map((view) => {
    const zIndex = viewsZIndexMap.get(view) ?? 0;

    return {
      view,
      zIndex,
    };
  });

  const viewsSortedByZIndex = sortBy(viewsWithZIndex, (viewInfo) => viewInfo.zIndex).map((viewInfo) => viewInfo.view);

  for (const nextView of viewsSortedByZIndex) {
    window.setTopBrowserView(nextView);
  }
}
