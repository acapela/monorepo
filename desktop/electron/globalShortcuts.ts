import { app, globalShortcut } from "electron";

import { createLogger } from "@aca/shared/log";
import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

import { globalShortcutPressed, registerGlobalShortcutRequest } from "../bridge/globalShortcuts";

const aliases: Record<string, string> = {
  meta: "CommandOrControl",
};

const log = createLogger("Global shortcut");

function convertShortcutKeysToElectronShortcut(keys: ShortcutKeys) {
  return keys
    .map((key) => {
      return aliases[key.toLowerCase()] ?? key;
    })
    .join("+");
}

export function initializeGlobalShortcuts() {
  registerGlobalShortcutRequest.handle(({ shortcut }) => {
    const electronShortcut = convertShortcutKeysToElectronShortcut(shortcut);

    log(`Registering - ${electronShortcut}`);
    const didRegister = globalShortcut.register(electronShortcut, () => {
      log(`Global Shortcut pressed - ${electronShortcut}`);
      globalShortcutPressed.send({ shortcut });
    });

    if (!didRegister) {
      log(`Failed to register 'show acapela' global shortcut`);
      return;
    }

    const clear = () => {
      log("Clearing shortcut");
      globalShortcut.unregister(electronShortcut);
    };

    app.on("will-quit", () => {
      clear();
    });

    return clear;
  });
}
