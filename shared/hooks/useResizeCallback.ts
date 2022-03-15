import { RefObject, useRef } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

function getSizeChange(previous: ResizeObserverEntry, current: ResizeObserverEntry) {
  const widthChange = Math.abs(previous.contentRect.width - current.contentRect.width);
  const heightChange = Math.abs(previous.contentRect.height - current.contentRect.height);

  return widthChange + heightChange;
}

/**
 * Allows calling given callback each time provided element resizes in the browser.
 *
 * It is useful for use cases like making sure tooltips has proper position, even if it's content
 * resizes for reasons undetectable for react.
 */
export function useResizeCallback(
  ref: RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry, element: HTMLElement) => void
) {
  const previousEntryRef = useRef<ResizeObserverEntry | null>(null);
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (previousEntryRef.current === null) {
        previousEntryRef.current = entry;
        callback(entry, element);
        return;
      }

      const sizeChange = getSizeChange(previousEntryRef.current, entry);

      previousEntryRef.current = entry;

      if (sizeChange < 1) return;

      callback(entry, element);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, callback]);
}
