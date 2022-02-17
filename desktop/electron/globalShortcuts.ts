import { app, globalShortcut } from "electron";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { createLogger } from "@aca/shared/log";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

import { appState } from "./appState";

function showMainWindow() {
  appState.mainWindow?.show();
}

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
  const clear = autorunEffect(() => {
    if (!applicationWideSettingsBridge.isReady) {
      return;
    }

    if (appState.isMainWindowFocused) return;

    const currentShortcut = applicationWideSettingsBridge.get().globalShowAppShortcut;

    if (!currentShortcut) return;

    const electronShortcut = convertShortcutKeysToElectronShortcut(currentShortcut);

    log(`Registering - ${electronShortcut}`);
    const didRegister = globalShortcut.register(electronShortcut, showMainWindow);

    if (!didRegister) {
      log(`Failed to register 'show acapela' global shortcut`);
      return;
    }

    return () => {
      log("Clearing shortcut");
      globalShortcut.unregister(electronShortcut);
    };
  });

  app.on("will-quit", () => {
    clear();
  });
}
