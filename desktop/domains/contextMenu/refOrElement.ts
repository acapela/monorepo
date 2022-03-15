import { isElement } from "lodash";
import { RefObject } from "react";

import { unsafeAssertType } from "@aca/shared/assert";

export type RefOrElement = RefObject<HTMLElement> | HTMLElement;

export function resolveRefOrElement(refOrElement: RefOrElement): HTMLElement | null {
  if (isElement(refOrElement)) {
    return refOrElement as HTMLElement;
  }

  unsafeAssertType<RefObject<HTMLElement>>(refOrElement);

  return refOrElement.current;
}
