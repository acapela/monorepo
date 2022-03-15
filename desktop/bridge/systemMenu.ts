import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { createChannelBridge } from "./base/channels";
import { createInvokeWithCleanupBridge } from "./base/invokeWithCleanup";

export interface SystemMenuItemData {
  id: string;
  path: string[];
  label: string;
  shortcut?: ShortcutDefinition;
  isDisabled?: boolean;
  isChecked?: boolean;
  group?: string;
}

export const addSystemMenuItem = createInvokeWithCleanupBridge<SystemMenuItemData>("add-system-menu-item");
export const systemMenuItemClicked = createChannelBridge<SystemMenuItemData>("system-menu-item-clicked");
