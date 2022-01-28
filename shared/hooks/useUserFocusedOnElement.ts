import { isEqual } from "lodash";
import { RefObject, useEffect } from "react";

import { createDocumentEvent, createElementEvent } from "../domEvents";
import { Point } from "../point";

let lastCursorPosition: Point | null = null;

/**
 * Will watch if user focused on some element.
 *
 * This is very similar to just doing 'onMouseEnter' and 'onMouseLeave', but with handling some edge cases.
 *
 * - if mouse was not moved, but page scrolled causing cursor to enter some element, even tho cursor did not move, we don't
 * want to treat it as user intent to focus. This is especially annoying with keyboard based scrolling.
 */

// We need to track cursor position to detect if some 'mouse enter' was actually caused by cursor movement
function getMousePositionFromEvent(event: MouseEvent): Point {
  return {
    x: event.screenX,
    y: event.screenY,
  };
}

createDocumentEvent("mousemove", (event) => {
  lastCursorPosition = getMousePositionFromEvent(event);
});

export function useUserFocusedOnElement(
  ref: RefObject<HTMLElement>,
  focusCallback?: () => void,
  blurCallback?: () => void
) {
  useEffect(() => {
    const { current: element } = ref;

    if (!element) return;

    const cleanEnter = createElementEvent(element, "mouseenter", (event) => {
      const cursorPosition = getMousePositionFromEvent(event);

      if (isEqual(cursorPosition, lastCursorPosition)) {
        return;
      }

      focusCallback?.();
    });

    const cleanLeave = createElementEvent(element, "mouseleave", (event) => {
      const cursorPosition = getMousePositionFromEvent(event);

      if (isEqual(cursorPosition, lastCursorPosition)) {
        return;
      }

      blurCallback?.();
    });

    return () => {
      cleanEnter();
      cleanLeave();
    };
  }, [ref, focusCallback, blurCallback]);
}
