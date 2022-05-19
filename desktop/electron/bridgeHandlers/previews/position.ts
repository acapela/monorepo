import { BrowserView, BrowserWindow } from "electron";
import { range, rangeRight } from "lodash";

import { PreviewPosition } from "@aca/desktop/domains/embed";
import { wait } from "@aca/shared/time";

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

export function setViewPosition(view: BrowserView, position: PreviewPosition, offsetLeft?: number) {
  viewPositionMap.set(view, position);

  const window = getBrowserViewParentWindow(view);

  if (!window) return;

  updateBrowserViewSize(view, window, position, offsetLeft);
}

export async function shiftVerticalViewPosition(view: BrowserView, position: PreviewPosition, isScrollingUp?: boolean) {
  viewPositionMap.set(view, position);

  const window = getBrowserViewParentWindow(view);

  if (!window) return;

  assertViewIsAttachedToWindow(view, window);

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;

  const { width, height } = await getWindowClientBounds(window);

  const ANIMATION_DURATION_IN_MS = 160;
  const ANIMATION_STEP_DURATION_IN_MS = 8;

  const AMOUNT_OF_STEPS = Math.round(ANIMATION_DURATION_IN_MS / ANIMATION_STEP_DURATION_IN_MS);

  const previewHeight = height - top - bottom;

  const offsetPerStep = previewHeight / AMOUNT_OF_STEPS;

  const offsets = !isScrollingUp
    ? rangeRight(0, offsetPerStep * AMOUNT_OF_STEPS, offsetPerStep)
    : range(0, offsetPerStep * AMOUNT_OF_STEPS, offsetPerStep);
  const promises: Promise<void>[] = [];
  for (const offset of offsets) {
    const electronRect = {
      x: left,
      y: top - (isScrollingUp ? -1 : 1) * Math.round(offset),
      width: width - left - right,
      height: height - top - bottom,
    };

    view.setBounds(electronRect);

    const waitPromise = wait(ANIMATION_STEP_DURATION_IN_MS);
    promises.push(waitPromise);
    await waitPromise;
  }

  return await Promise.all(promises);
}

export async function animatePreviewSwipe({
  topView,
  bottomView,
  position,
  direction,
}: {
  topView: BrowserView;
  bottomView: BrowserView;
  position: PreviewPosition;
  direction: "swipe-up" | "swipe-down";
}) {
  viewPositionMap.set(topView, position);
  viewPositionMap.set(bottomView, position);

  const window = getBrowserViewParentWindow(topView);

  if (!window) return;

  // assertViewIsAttachedToWindow(topView, window);
  // assertViewIsAttachedToWindow(bottomView, window);

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;

  const { width, height } = await getWindowClientBounds(window);

  const ANIMATION_DURATION_IN_MS = 200;
  const ANIMATION_STEP_DURATION_IN_MS = 8;

  const AMOUNT_OF_STEPS = Math.round(ANIMATION_DURATION_IN_MS / ANIMATION_STEP_DURATION_IN_MS);

  const previewHeight = height - top - bottom;

  const offsetPerStep = previewHeight / AMOUNT_OF_STEPS;

  const offsets = [...range(0, offsetPerStep * AMOUNT_OF_STEPS, offsetPerStep), width];

  const promises: Promise<void>[] = [];

  for (let i = 0; i < offsets.length; i++) {
    const inverseIndex = offsets.length - 1 - i;
    const topOffset = Math.round(direction === "swipe-up" ? -1 * offsets[i] : -1 * offsets[inverseIndex]);
    const bottomOffset = Math.round(direction === "swipe-up" ? offsets[inverseIndex] : offsets[i]);

    const topElectronRect = {
      x: left,
      y: top + topOffset,
      width: width - left - right,
      height: height - top - bottom,
    };

    const bottomElectronRect = {
      x: left,
      y: top + bottomOffset,
      width: width - left - right,
      height: height - top - bottom,
    };

    topView.setBounds(topElectronRect);
    bottomView.setBounds(bottomElectronRect);

    const waitPromise = wait(ANIMATION_STEP_DURATION_IN_MS);
    promises.push(waitPromise);

    await waitPromise;
  }

  return await Promise.all(promises);
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

async function updateBrowserViewSize(
  view: BrowserView,
  window: BrowserWindow,
  position: PreviewPosition,
  leftOffset?: number
) {
  assertViewIsAttachedToWindow(view, window);

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;

  const { width, height } = await getWindowClientBounds(window);

  const electronRect = {
    x: left - (leftOffset ?? 0),
    y: top,
    width: width - left - right,
    height: height - top - bottom,
  };

  view.setBounds(electronRect);
}
