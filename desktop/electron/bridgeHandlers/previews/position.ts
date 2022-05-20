import { BrowserView, BrowserWindow } from "electron";
import { GenerateSpringFrames } from "spring-easing";

import { PreviewPosition } from "@aca/desktop/domains/embed";
import type { HorizontalAnimations, VerticalAnimations } from "@aca/desktop/domains/embed/animationStore";
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

export function setViewPosition(view: BrowserView, position: PreviewPosition) {
  viewPositionMap.set(view, position);

  const window = getBrowserViewParentWindow(view);

  if (!window) return;

  updateBrowserViewSize(view, window, position);
}

const AMOUNT_OF_ANIMATION_STEPS = 120;

const [springAnimationFrames] = GenerateSpringFrames({
  numPoints: AMOUNT_OF_ANIMATION_STEPS,
  easing: "spring(1, 80, 20, 0)",
});

const ANIMATION_DURATION_IN_MS = 350;
const ANIMATION_STEP_DURATION_IN_MS = Math.round(ANIMATION_DURATION_IN_MS / springAnimationFrames.length);

export async function animateVerticalPreviewSwipe({
  topView,
  bottomView,
  position,
  direction,
}: {
  topView: BrowserView;
  bottomView: BrowserView;
  position: PreviewPosition;
  direction: VerticalAnimations;
}) {
  viewPositionMap.set(topView, position);
  viewPositionMap.set(bottomView, position);

  const window = getBrowserViewParentWindow(topView);

  if (!window) return;

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;
  const { width, height } = await getWindowClientBounds(window);
  const previewHeight = height - top - bottom;
  const basePositionProps = {
    x: left,
    width: width - left - right,
    height: height - top - bottom,
  };

  const offsetTuples = springAnimationFrames.map((f) => [
    Math.round(f * previewHeight),
    previewHeight - Math.round(f * previewHeight),
  ]);

  for (const [downDirectionHeightOffset, upDirectionHeightOffset] of offsetTuples) {
    const topOffset = direction === "swipe-up" ? -1 * downDirectionHeightOffset : -1 * upDirectionHeightOffset;
    const bottomOffset = direction === "swipe-up" ? upDirectionHeightOffset : downDirectionHeightOffset;

    const topElectronRect = {
      y: top + topOffset,
      ...basePositionProps,
    };

    const bottomElectronRect = {
      y: top + bottomOffset,
      ...basePositionProps,
    };

    topView.setBounds(topElectronRect);
    bottomView.setBounds(bottomElectronRect);

    await wait(ANIMATION_STEP_DURATION_IN_MS);
  }
}

export async function animateHorizontalPreviewSwipe({
  leftView,
  rightView,
  position,
  direction,
}: {
  leftView: BrowserView;
  rightView: BrowserView;
  position: PreviewPosition;
  direction: HorizontalAnimations;
}) {
  viewPositionMap.set(leftView, position);
  viewPositionMap.set(rightView, position);

  const window = getBrowserViewParentWindow(leftView);

  if (!window) return;

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = position;

  const { width, height } = await getWindowClientBounds(window);

  const previewWidth = width - left - right;

  const basePositionProps = {
    y: top,
    width: previewWidth,
    height: height - top - bottom,
  };

  const offsetTuples = springAnimationFrames.map((f) => [
    Math.round(f * previewWidth),
    previewWidth - Math.round(f * previewWidth),
  ]);

  for (const [rightDirectionWidthOffset, leftDirectionWidthOffset] of offsetTuples) {
    const leftOffset = direction === "swipe-left" ? -1 * rightDirectionWidthOffset : -1 * leftDirectionWidthOffset;
    const rightOffset = direction === "swipe-left" ? leftDirectionWidthOffset : rightDirectionWidthOffset;

    const topElectronRect = {
      x: left + leftOffset,
      ...basePositionProps,
    };

    const bottomElectronRect = {
      x: left + rightOffset,
      ...basePositionProps,
    };

    leftView.setBounds(topElectronRect);
    rightView.setBounds(bottomElectronRect);

    await wait(ANIMATION_STEP_DURATION_IN_MS);
  }
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
