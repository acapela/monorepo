import { appState } from "@aca/desktop/electron/appState";
import { autorunEffect } from "@aca/shared/mobxUtils";

import { startNotionSync } from "./notion/worker";

export type NotificationServiceName = "notion";

export function initializeServiceSync() {
  const notionSync = startNotionSync();

  function handleWindowFocus() {
    notionSync.onWindowFocus();
  }

  function handleWindowBlur() {
    notionSync.onWindowBlur();
  }

  autorunEffect(() => {
    // Each time main window is changed - attach proper listeners
    const { mainWindow } = appState;

    if (!mainWindow) return;

    mainWindow.on("blur", handleWindowBlur);
    mainWindow.on("focus", handleWindowFocus);

    return () => {
      mainWindow.off("blur", handleWindowBlur);
      mainWindow.off("focus", handleWindowFocus);
    };
  });
}
