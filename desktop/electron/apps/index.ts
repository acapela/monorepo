import { workerSyncStart } from "@aca/desktop/bridge/apps";
import { appState } from "@aca/desktop/electron/appState";
import { autorunEffect } from "@aca/shared/mobxUtils";

import { startFigmaSync } from "./figma/worker";
import { startNotionSync } from "./notion/worker";
import { ServiceSyncController } from "./types";

export type NotificationServiceName = "notion";

const onWindowsFocusHandlers: Array<() => void> = [];
const onWindowsBlurHandlers: Array<() => void> = [];

function addHandler(controller: ServiceSyncController) {
  onWindowsFocusHandlers.push(controller.onWindowFocus);
  onWindowsBlurHandlers.push(controller.onWindowBlur);
}

export function initializeServiceSync() {
  workerSyncStart.handle(async (isAbleToStart: boolean) => {
    if (isAbleToStart) {
      addHandler(startNotionSync());
      startFigmaSync();
    }
  });

  function handleWindowFocus() {
    onWindowsFocusHandlers.forEach((handler) => handler());
  }

  function handleWindowBlur() {
    onWindowsBlurHandlers.forEach((handler) => handler());
  }

  autorunEffect(() => {
    // Each time main window is changed - attach proper listeners
    const { mainWindow } = appState;

    if (!mainWindow) return;

    mainWindow.on("blur", handleWindowBlur);
    mainWindow.on("focus", handleWindowFocus);
  });
}
