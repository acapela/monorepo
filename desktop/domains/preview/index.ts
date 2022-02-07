import { Point } from "@aca/shared/point";

/**
 * For preview views and keeping it in sync with main window, we need to somehow inform electron
 * about preview size.
 *
 * However!
 * Instead of measuring exact size of view, we measure distance to edges (exactly the same way as position: absolute works).
 *
 * Those values change way less frequently (usually never), even if element resizes,
 * yet, it still allows electron to calculate correct size on its own.
 * This way resizing happens on electron side, avoiding dropped frames or delays, providing very smooth experience.
 */
export interface PreviewPosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export enum PreviewLoadingPriority {
  current = 0,
  next = 1,
  following = 2,
}

function getViewportSize(): Point {
  return {
    x: window.innerWidth,
    y: window.innerHeight,
  };
}

/**
 * Will take distance to all edges from HTML element
 */
export function getPreviewPositionFromElement(element: HTMLElement): PreviewPosition {
  const viewport = getViewportSize();
  const rect = element.getBoundingClientRect();

  return {
    // We don't need float precision
    top: Math.round(rect.top),
    left: Math.round(rect.left),
    bottom: Math.round(viewport.y - rect.bottom),
    right: Math.round(viewport.x - rect.right),
  };
}
