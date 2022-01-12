import { RefObject, useEffect } from "react";

import { createElementEvent } from "@aca/shared/domEvents";
import { createTimeout } from "@aca/shared/time";

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
  useEffect(() => {
    if (!ref.current) return;
    if (options?.isEnabled === false) return;

    /**
     * Timeout called after 'first click' that is waiting for 2nd click.
     *
     * If 2nd click will not happen, it'll then dispatch click normally and clear this variable.
     */
    let waitingAfterFirstClickTimeout: (() => void) | null = null;

    /**
     * Flag indicating that 2nd click did not happen after timeout so we're emitting click normally without interrupting it
     * in any way.
     */
    let isEmittingClickEvent = false;

    // Now let's attach click event.
    return createElementEvent(ref.current, "click", (event) => {
      // This click event is dispatched by us after unsuccessful waiting for 2nd click. Just pass it normally without doing anything.
      if (isEmittingClickEvent) {
        isEmittingClickEvent = false;
        return;
      }

      // Don't allow event to be captured by other listeners.
      event.stopPropagation();
      event.preventDefault();

      /**
       * This is 2nd click as we were waiting after 1st click!
       */
      if (waitingAfterFirstClickTimeout) {
        // Clear waiting for 2nd click.
        waitingAfterFirstClickTimeout();
        waitingAfterFirstClickTimeout = null;
        // We can call double click callback.
        callback();

        return;
      }

      /**
       * This is 1st click.
       *
       * Attach timeout waiting for 2nd click
       */
      waitingAfterFirstClickTimeout = createTimeout(() => {
        // 2nd click did not happen after timeout.

        // Clear waiting variable
        waitingAfterFirstClickTimeout = null;

        // Indicate we'll now manually emit 'single' click event for other listeners to capture.
        isEmittingClickEvent = true;
        // Emit click event
        ref.current?.click();
      }, options?.secondClickWaitTime ?? DEFAULT_SECOND_CLICK_TIMEOUT);
    });
  }, [ref, ref.current, callback, options?.isEnabled, options?.secondClickWaitTime]);
}
