import { RefObject, useEffect, useRef } from "react";

function getSizeChange(previous: ResizeObserverEntry, current: ResizeObserverEntry) {
  const widthChange = Math.abs(previous.contentRect.width - current.contentRect.width);
  const heightChange = Math.abs(previous.contentRect.height - current.contentRect.height);

  return widthChange + heightChange;
}

export function useResizeCallback(ref: RefObject<HTMLElement>, callback: (entry: ResizeObserverEntry) => void) {
  const previousEntryRef = useRef<ResizeObserverEntry | null>(null);
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (previousEntryRef.current === null) {
        previousEntryRef.current = entry;
        callback(entry);
        return;
      }

      const sizeChange = getSizeChange(previousEntryRef.current, entry);

      previousEntryRef.current = entry;

      if (sizeChange < 1) return;

      callback(entry);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, callback]);
}
