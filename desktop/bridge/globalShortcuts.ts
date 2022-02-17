import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

import { createChannelBridge } from "./base/channels";
import { createInvokeWithCleanupBridge } from "./base/invokeWithCleanup";

export const registerGlobalShortcutRequest =
  createInvokeWithCleanupBridge<{ shortcut: ShortcutKeys }>("register-global-shortcut");
export const globalShortcutPressed = createChannelBridge<{ shortcut: ShortcutKeys }>("global-shortcut-pressed");
