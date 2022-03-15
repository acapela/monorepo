import { Menu, MenuItemConstructorOptions } from "electron";

import { showContextMenuRequest } from "@aca/desktop/bridge/menu";
import { ContextMenuItem } from "@aca/desktop/domains/contextMenu/types";
import { assert } from "@aca/shared/assert";
import { groupBy } from "@aca/shared/groupBy";
import { createResolvablePromise } from "@aca/shared/promises";

import { getSourceWindowFromIPCEvent } from "../utils/ipc";
import { convertShortcutKeysToElectronShortcut } from "./utils/shortcuts";

function convertContextMenuItemDataToElectron(item: ContextMenuItem, onClicked: () => void) {
  const { shortcut, group, ...electronItem } = item;
  // ! We dont want group to be directly passed to electron
  group;
  function getAccelerator() {
    if (!shortcut) return;

    return convertShortcutKeysToElectronShortcut(shortcut);
  }

  return {
    ...electronItem,
    accelerator: getAccelerator(),
    click() {
      onClicked();
    },
  };
}

function prepareContextMenuElectronData(
  items: ContextMenuItem[],
  onItemPicked: (item: ContextMenuItem) => void
): MenuItemConstructorOptions[] {
  const groups = groupBy(
    items,
    (item) => item.group,
    (group) => group ?? "no-group"
  );

  const finalItems: MenuItemConstructorOptions[] = [];

  groups.forEach(({ items }, index) => {
    const isLast = index === groups.length - 1;

    const electronItems = items.map((item) => {
      return convertContextMenuItemDataToElectron(item, () => {
        onItemPicked(item);
      });
    });

    finalItems.push(...electronItems);

    if (!isLast) {
      finalItems.push({ type: "separator" });
    }
  });

  return finalItems;
}

export function initializeContextMenuHandlers() {
  showContextMenuRequest.handle(async (items, event) => {
    assert(event, "Context menu can only be invoked by window");
    const window = getSourceWindowFromIPCEvent(event);

    const { resolve, promise } = createResolvablePromise<ContextMenuItem | null>();

    const electronItems = prepareContextMenuElectronData(items, (item) => {
      resolve(item);
    });

    if (!window) return null;

    const menu = Menu.buildFromTemplate(electronItems);

    menu.popup({ window });

    menu.once("menu-will-close", () => {
      // resolve(null);
    });

    return promise;
  });
}
