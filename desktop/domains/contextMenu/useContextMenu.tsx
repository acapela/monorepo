import { isElement } from "lodash";
import { RefObject, useEffect } from "react";

import { showContextMenuRequest } from "@aca/desktop/bridge/menu";
import { unsafeAssertType } from "@aca/shared/assert";
import { createElementEvent } from "@aca/shared/domEvents";

import { RefOrElement, resolveRefOrElement } from "./refOrElement";
import { ContextMenuItem } from "./types";

export function useContextMenu(
  refOrElement: RefOrElement,
  items: ContextMenuItem[],
  onSelected?: (item: ContextMenuItem) => void
) {
  useEffect(() => {
    const element = resolveRefOrElement(refOrElement);

    if (!element) return;

    return createElementEvent(element, "contextmenu", async (event) => {
      event.stopPropagation();

      const selectedItem = await showContextMenuRequest(items);

      console.log({ selectedItem });

      if (selectedItem) {
        onSelected?.(selectedItem);
      }
    });
  }, [refOrElement, items]);
}
