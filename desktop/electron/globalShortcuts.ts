import { app, globalShortcut } from "electron";

import { appState } from "./appState";

const SHOW_ACAPELA_SHORTCUT = "CommandOrControl+Shift+A";

export function initializeGlobalShortcuts() {
  const didRegister = globalShortcut.register(SHOW_ACAPELA_SHORTCUT, () => {
    const { mainWindow } = appState;

    if (!mainWindow) return;

    mainWindow.show();
  });

  app.on("will-quit", () => {
    globalShortcut.unregister(SHOW_ACAPELA_SHORTCUT);
  });

  if (!didRegister) {
    console.warn(`Failed to register 'show acapela' global shortcut`);
  }
}
