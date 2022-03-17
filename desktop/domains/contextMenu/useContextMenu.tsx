import { omit } from "lodash";
import { useEffect } from "react";

import { showContextMenuRequest } from "@aca/desktop/bridge/menu";
import { createElementEvent } from "@aca/shared/domEvents";
import { useMethod } from "@aca/shared/hooks/useMethod";

import { RefOrElement, resolveRefOrElement } from "./refOrElement";
import { ContextMenuItem } from "./types";

export type ContextMenuItemWithCallback = ContextMenuItem & {
  onSelected?: () => void;
};

export function useContextMenu(refOrElement: RefOrElement, itemsGetter: () => ContextMenuItemWithCallback[]) {
  const itemsGetterRef = useMethod(itemsGetter);

  useEffect(() => {
    const element = resolveRefOrElement(refOrElement);

    if (!element) return;

    return createElementEvent(element, "contextmenu", async (event) => {
      event.stopPropagation();

      const items = itemsGetterRef();

      const rawItems = items.map((item) => omit(item, "onSelected"));

      const selectedItem = await showContextMenuRequest(rawItems);

      if (selectedItem) {
        const originalItem = items.find((item) => item.id === selectedItem.id);
        originalItem?.onSelected?.();
      }
    });
  }, [refOrElement, itemsGetter]);
}
