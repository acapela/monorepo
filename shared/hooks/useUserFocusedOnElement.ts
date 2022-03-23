import { RefObject, useEffect } from "react";

import { createDocumentEvent, createElementEvent } from "@aca/shared/domEvents";

import { createLazyChangeCallback } from "../callbacks/lazyChangeCallback";
import { createCleanupObject } from "../cleanup";

/**
 * Will watch if user focused on some element.
 *
 * This is very similar to just doing 'onMouseEnter' and 'onMouseLeave', but with handling some edge cases.
 *
 * - if mouse was not moved, but page scrolled causing cursor to enter some element, even tho cursor did not move, we don't
 * want to treat it as user intent to focus. This is especially annoying with keyboard based scrolling.
 */

let lastCursorMoveTime: number | null = null;

createDocumentEvent("mousemove", () => {
  lastCursorMoveTime = Date.now();
});

const TIME_SINCE_LAST_MOVE_TO_CONSIDER_USER_ACTION = 50;

function getIsUserEnterOrLeaveEvent() {
  if (!lastCursorMoveTime) return true;
  return Math.abs(Date.now() - lastCursorMoveTime) <= TIME_SINCE_LAST_MOVE_TO_CONSIDER_USER_ACTION;
}

export function useUserFocusedOnElement(
  ref: RefObject<HTMLElement>,
  focusCallback?: () => void,
  blurCallback?: () => void
) {
  useEffect(() => {
    const { current: element } = ref;

    if (!element) return;

    const cleanup = createCleanupObject();

    /**
     * Let's not spam focusCallback on each mouse move
     */
    const handleFocusSignal = createLazyChangeCallback((isFocused: boolean) => {
      if (isFocused) {
        focusCallback?.();
      } else {
        blurCallback?.();
      }
    });

    cleanup.next = createElementEvent(element, "mouseenter", () => {
      if (!getIsUserEnterOrLeaveEvent()) {
        return;
      }

      handleFocusSignal(true);
    });

    cleanup.next = createElementEvent(element, "mousemove", () => {
      handleFocusSignal(true);
    });

    cleanup.next = createElementEvent(element, "mouseleave", () => {
      if (!getIsUserEnterOrLeaveEvent()) {
        return;
      }

      handleFocusSignal(false);
    });

    return cleanup.clean;
  }, [ref, focusCallback, blurCallback]);
}
