import { RefObject, useLayoutEffect } from "react";
import { useEqualState } from "./useEqualState";
import { useResizeCallback } from "./useResizeCallback";

type PlainDomRect = Omit<DOMRect, "toJSON">;

function getDefaultSize(ref: RefObject<HTMLElement>): PlainDomRect {
  if (ref.current) {
    return ref.current.getBoundingClientRect();
  }

  const rect: PlainDomRect = {
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  };

  return rect;
}

/**
 * Will return current bounding box of an element.
 */
export function useBoundingBox(ref: RefObject<HTMLElement>) {
  const [box, setBox] = useEqualState<PlainDomRect>(() => getDefaultSize(ref));

  useResizeCallback(ref, (entry) => {
    setBox(entry.contentRect);
  });

  useLayoutEffect(() => {
    if (!ref.current) return;

    setBox(ref.current.getBoundingClientRect());
  }, []);

  return box;
}
