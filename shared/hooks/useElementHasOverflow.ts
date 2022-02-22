import { RefObject, useState } from "react";

import { useResizeCallback } from "./useResizeCallback";

function getElementHasOverflow(element: HTMLElement) {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientWidth;
}

export function useElementHasOverflow(ref: RefObject<HTMLElement>) {
  const [hasOverflow, setHasOverflow] = useState(false);

  useResizeCallback(ref, (_, element) => {
    setHasOverflow(getElementHasOverflow(element));
  });

  return hasOverflow;
}
