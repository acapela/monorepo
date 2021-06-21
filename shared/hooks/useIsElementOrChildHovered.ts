import { RefObject, useEffect } from "react";
import { createElementEvent } from "~shared/domEvents";
import { useBoolean } from "./useBoolean";

export function useIsElementOrChildHovered(ref: RefObject<HTMLElement>) {
  const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);

  useEffect(() => {
    const element = ref.current;

    console.log({ element });

    if (!element) return;

    const cleanEnter = createElementEvent(element, "mouseenter", () => {
      setHovered();
      console.log("okidoki");
    });

    const cleanLeave = createElementEvent(element, "mouseleave", () => {
      unsetHovered();
      console.log("okidoki999");
    });

    return () => {
      cleanEnter();
      cleanLeave();
    };
  }, [ref]);

  return isHovered;
}
