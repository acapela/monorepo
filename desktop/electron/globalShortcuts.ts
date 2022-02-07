import { app, globalShortcut } from "electron";
import { autorun } from "mobx";

import { globalShortcutsValue } from "@aca/desktop/bridge/system";

import { appState } from "./appState";

function showMainWindow() {
  appState.mainWindow?.show();
}

export function initializeGlobalShortcuts() {
  let currentShortcut: string | null = null;
  autorun(() => {
    if (!globalShortcutsValue.isReady) {
      return;
    }

    if (currentShortcut) {
      globalShortcut.unregister(currentShortcut);
    }
    currentShortcut = globalShortcutsValue.get().show;
    const didRegister = currentShortcut && globalShortcut.register(currentShortcut, showMainWindow);
    if (!didRegister) {
      console.warn(`Failed to register 'show acapela' global shortcut`);
    }
  });

  appState.mainWindow?.on("focus", () => {
    if (currentShortcut) {
      globalShortcut.unregister(currentShortcut);
    }
  });
  appState.mainWindow?.on("blur", () => {
    if (currentShortcut) {
      // We can deregister the show shortcut when the main window is already shown, that way it can also be used within
      // the app
      globalShortcut.register(currentShortcut, showMainWindow);
    }
  });

  app.on("will-quit", () => {
    if (currentShortcut) {
      globalShortcut.unregister(currentShortcut);
    }
  });
}
