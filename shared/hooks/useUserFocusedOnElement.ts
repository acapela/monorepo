import { RefObject, useEffect } from "react";

import { createDocumentEvent, createElementEvent } from "@aca/shared/domEvents";

import { createLazyChangeCallback } from "../callbacks/lazyChangeCallback";
import { createCleanupObject } from "../cleanup";
import { cancellableDebounce } from "../debounce";

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

/**
 * This is optimization avoiding 'growing computation debt' resulting in performance issues.
 *
 * example:
 * if user focuses on notification - a lot of mobx stores have to re-compute - let's say such computations take 10ms (seems all good as it is less than a frame)
 * now lets say user rapidly focused 20 notifications one after another starting from notification 1 to notification 20
 * Now notification 20 is focused, but JS still has to execute all callbacks for 1,2,3,4 etc even tho those are instantly replaced be next ones
 * This way if user keeps rapidly changing focus, JS has more and more 'computation debt' it has to perform and it'll easily
 * get longer together than 1 frame time resulting in dropped frames.
 *
 * Thanks to below, we make sure that if many focus changes happened before previous computations had chance to complete, all the middle ones will never get executed.
 *
 * It uses `cancellableDebounce` as eg if some notification get unmounted while it's focus is pending - it can cancel itself, but not the other pending call if present (lodash debounce has only one .cancel when we dont know if we cancel 'our' call or call made by 'someone else')
 */
const sharedDebouncedMarkUserFocus = cancellableDebounce((callback: () => void) => {
  callback();
}, 0);

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
      if (isFocused && focusCallback) {
        cleanup.next = sharedDebouncedMarkUserFocus(focusCallback);
      } else if (blurCallback) {
        cleanup.next = sharedDebouncedMarkUserFocus(blurCallback);
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
