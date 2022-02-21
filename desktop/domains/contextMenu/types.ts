import type { MenuItemConstructorOptions } from "electron";

import { ShortcutDefinition, ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

interface ContextMenuItemExtra {
  shortcut?: ShortcutDefinition;
}

export type ContextMenuItem = Pick<
  MenuItemConstructorOptions,
  "id" | "label" | "type" | "toolTip" | "enabled" | "checked" | "sublabel"
> &
  ContextMenuItemExtra;
