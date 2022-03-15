import { app, globalShortcut } from "electron";

import { globalShortcutPressed, registerGlobalShortcutRequest } from "@aca/desktop/bridge/globalShortcuts";
import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

import { makeLogger } from "../domains/dev/makeLogger";

const aliases: Record<string, string> = {
  meta: "CommandOrControl",
};

const log = makeLogger("Global shortcut");

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
