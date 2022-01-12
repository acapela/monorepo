import { noop } from "lodash";

import { createInterval } from "@aca/shared/time";

/**
 * Will return promise that resolves when given element position or size stops animating
 */
export function waitForElementPossitionToSettle(element: HTMLElement) {
  // Arbitral value - we'll check every 2nd frame
  const CHECK_INTERVAL = 1000 / 30;
  // If total difference of all dimensions is smaller than 2px, let's consider it settled. (will resolve faster in long ease-out animations)
  const SETTLE_DIFFERENCE_PX = 2;
  let clearCallback = noop;

  function cancel() {
    clearCallback();
  }
  const settlePromise = new Promise<void>((resolve) => {
    let lastRect = element.getBoundingClientRect();

    clearCallback = createInterval(() => {
      const rectNow = element.getBoundingClientRect();

      if (getAreDOMRectsSimilar(lastRect, rectNow, SETTLE_DIFFERENCE_PX)) {
        clearCallback();
        resolve();
        return;
      }

      lastRect = rectNow;
    }, CHECK_INTERVAL);
  });

  return [settlePromise, cancel] as const;
}

// Will return 'scalar' of DOMRect object as single number
function getRectSume(rect: DOMRect) {
  const { x, y, top, bottom, left, right, height, width } = rect;

  return x + y + top + bottom + left + right + height + width;
}

function getDOMRectsDifference(rectA: DOMRect, rectB: DOMRect) {
  return Math.abs(getRectSume(rectA) - getRectSume(rectB));
}

function getAreDOMRectsSimilar(rectA: DOMRect, rectB: DOMRect, maxDifference = 3) {
  return getDOMRectsDifference(rectA, rectB) <= maxDifference;
}
