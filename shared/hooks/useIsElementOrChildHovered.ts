import { RefObject, useEffect } from "react";

import { createElementEvent } from "@aca/shared/domEvents";

import { useBoolean } from "./useBoolean";

export function useIsElementOrChildHovered(ref: RefObject<HTMLElement>) {
  const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const cleanEnter = createElementEvent(element, "mouseenter", () => {
      setHovered();
    });

    const cleanLeave = createElementEvent(element, "mouseleave", () => {
      unsetHovered();
    });

    return () => {
      cleanEnter();
      cleanLeave();
    };
  }, [ref]);

  return isHovered;
}
