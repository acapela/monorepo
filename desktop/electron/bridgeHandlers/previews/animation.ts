import { BrowserView } from "electron";
import { GenerateSpringFrames } from "spring-easing";

import { PreviewPosition } from "@aca/desktop/domains/embed";
import { HorizontalAnimations, VerticalAnimations } from "@aca/desktop/domains/embed/animationStore";
import { wait } from "@aca/shared/time";

import { getBrowserViewParentWindow } from "../../windows/viewUtils";
import { getWindowClientBounds, viewPositionMap } from "./position";

const AMOUNT_OF_ANIMATION_STEPS = 120;

const [springAnimationFrames] = GenerateSpringFrames({
  numPoints: AMOUNT_OF_ANIMATION_STEPS,
  easing: "spring(1, 80, 20, 0)",
});

const ANIMATION_DURATION_IN_MS = 310;
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
