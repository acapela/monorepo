import { Menu, MenuItem, MenuItemConstructorOptions } from "electron";

import { showContextMenuRequest } from "@aca/desktop/bridge/menu";
import { ContextMenuItem } from "@aca/desktop/domains/contextMenu/types";
import { assert } from "@aca/shared/assert";
import { createResolvablePromise } from "@aca/shared/promises";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";
import { ShortcutDefinition, resolveShortcutsDefinition } from "@aca/ui/keyboard/shortcutBase";

import { getSourceWindowFromIPCEvent } from "../utils/ipc";

const aliases: Record<string, string> = {
  meta: "CommandOrControl",
  mod: "CommandOrControl",
};

function convertShortcutKeysToElectronShortcut(shortcut: ShortcutDefinition) {
  console.log({ shortcut });
  return resolveShortcutsDefinition(shortcut)
    .map((key) => {
      return aliases[key.toLowerCase()] ?? key;
    })
    .join("+");
}

export function initializeContextMenuHandlers() {
  showContextMenuRequest.handle(async (items, event) => {
    assert(event, "Context menu can only be invoked by window");
    const window = getSourceWindowFromIPCEvent(event);

    const { resolve, promise } = createResolvablePromise<ContextMenuItem | null>();

    const electronItems = items.map((item): MenuItemConstructorOptions => {
      const { shortcut, ...electronItem } = item;

      function getAccelerator() {
        if (!shortcut) return;

        return convertShortcutKeysToElectronShortcut(shortcut);
      }

      return {
        ...electronItem,
        accelerator: getAccelerator(),
        click() {
          console.log("RESOLVED", item);
          resolve(item);
        },
      };
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
