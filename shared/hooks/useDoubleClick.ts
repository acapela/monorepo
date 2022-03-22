import { RefObject, useEffect } from "react";

import { createElementEvent } from "@aca/shared/domEvents";

import { useMethod } from "./useMethod";

interface Options {
  isEnabled?: boolean;
  secondClickWaitTime?: number;
}

const DEFAULT_SECOND_CLICK_TIMEOUT = 250;

/**
 * Allows attaching double click event to an element.
 *
 * It's a bit 'smarter' than normal <div onDoubleClick />:
 *
 * It will prevent any action on first click (event if parents have onClick) and then wait 2nd click delay.
 *
 * If 2nd click happens - will call double click callback.
 *
 * If 2nd click will not happen - it'll dispatch first click again, this time not blocking it.
 *
 * Result it that 'single' click will be executed with delay.
 */
export function useDoubleClick(ref: RefObject<HTMLElement>, callback: () => void, options?: Options) {
  const callbackRef = useMethod(callback);
  useEffect(() => {
    const element = ref.current!;
    if (!element) return;

    if (options?.isEnabled === false) return;

    const timeoutMs = options?.secondClickWaitTime ?? DEFAULT_SECOND_CLICK_TIMEOUT;

    let lastClickEvent: MouseEvent | null = null;

    return createElementEvent(element, "click", (event) => {
      if (!lastClickEvent) {
        lastClickEvent = event;
        return;
      }

      const previousClick = lastClickEvent;
      lastClickEvent = event;

      if (previousClick.defaultPrevented) {
        return;
      }

      const timeSinceLastClick = event.timeStamp - previousClick.timeStamp;

      if (timeSinceLastClick > timeoutMs) {
        return;
      }

      callbackRef();
    });
  }, [ref, ref.current, options?.isEnabled, options?.secondClickWaitTime]);
}
