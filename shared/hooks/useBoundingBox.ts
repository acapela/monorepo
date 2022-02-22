import { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

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

function getSerializableBoundingBox(box: DOMRect): PlainDomRect {
  const rect: PlainDomRect = {
    bottom: box.bottom,
    top: box.top,
    left: box.left,
    right: box.right,
    x: box.x,
    y: box.y,
    height: box.height,
    width: box.width,
  };

  return rect;
}

/**
 * Will return current bounding box of an element.
 */
export function useBoundingBox(ref: RefObject<HTMLElement>) {
  const [box, setBox] = useEqualState<PlainDomRect>(() => getDefaultSize(ref));

  function updateBox() {
    if (!ref.current) return;

    const newBox = getSerializableBoundingBox(ref.current.getBoundingClientRect());

    setBox(newBox);
  }

  useResizeCallback(ref, updateBox);

  useIsomorphicLayoutEffect(updateBox);

  return box;
}
