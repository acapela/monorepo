import type { MenuItemConstructorOptions } from "electron";

import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

interface ContextMenuItemExtra {
  shortcut?: ShortcutDefinition;
  group?: string;
}

export type ContextMenuItem = Pick<
  MenuItemConstructorOptions,
  "id" | "label" | "type" | "toolTip" | "enabled" | "checked" | "sublabel"
> &
  ContextMenuItemExtra;
