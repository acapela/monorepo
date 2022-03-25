import { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

import { useMethod } from "./useMethod";

function getSizeChange(previous: DOMRectReadOnly, current: DOMRectReadOnly) {
  const widthChange = Math.abs(previous.width - current.width);
  const heightChange = Math.abs(previous.height - current.height);

  return widthChange + heightChange;
}

function didValueChangeFromZero(before: number, now: number) {
  if (before === now) return false;

  return before === 0 || now === 0;
}

export function watchElementSize(
  element: HTMLElement,
  callback: (entry: ResizeObserverEntry, element: HTMLElement) => void,
  sizeChangeTreshold = 0
) {
  let previousEntry: ResizeObserverEntry | null = null;

  let accumulatedSizeChange = 0;

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (previousEntry === null) {
      previousEntry = entry;
      callback(entry, element);
      return;
    }

    const sizeChange = getSizeChange(previousEntry.contentRect, entry.contentRect);

    if (sizeChangeTreshold <= 0) {
      callback(entry, element);
      return;
    }

    const didToggleVisible =
      didValueChangeFromZero(previousEntry.contentRect.height, entry.contentRect.height) ||
      didValueChangeFromZero(previousEntry.contentRect.width, entry.contentRect.width);

    accumulatedSizeChange += sizeChange;

    previousEntry = entry;

    if (accumulatedSizeChange < sizeChangeTreshold && !didToggleVisible) {
      return;
    }

    accumulatedSizeChange = 0;

    callback(entry, element);
  });

  resizeObserver.observe(element);

  return () => {
    resizeObserver.disconnect();
  };
}

/**
 * Allows calling given callback each time provided element resizes in the browser.
 *
 * It is useful for use cases like making sure tooltips has proper position, even if it's content
 * resizes for reasons undetectable for react.
 */
export function useResizeCallback(
  ref: RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry, element: HTMLElement) => void,
  sizeChangeTreshold = 0
) {
  const callbackRef = useMethod(callback);
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    return watchElementSize(element, callbackRef, sizeChangeTreshold);
  }, [ref, sizeChangeTreshold]);
}
