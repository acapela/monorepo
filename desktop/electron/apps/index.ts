import { workerSyncStart } from "@aca/desktop/bridge/apps";
import { appState } from "@aca/desktop/electron/appState";
import { autorunEffect } from "@aca/shared/mobxUtils";

import { isFigmaReadyToSync, startFigmaSync } from "./figma/worker";
import { isNotionReadyToSync, startNotionSync } from "./notion/worker";
import { ServiceSyncController } from "./types";

export type NotificationServiceName = "notion";

const onWindowsFocusHandlers: Array<() => void> = [];
const onWindowsBlurHandlers: Array<() => void> = [];

function addHandler(controller: ServiceSyncController) {
  onWindowsFocusHandlers.push(controller.onWindowFocus);
  onWindowsBlurHandlers.push(controller.onWindowBlur);
}

function startNotionIfReady() {
  if (!isNotionReadyToSync()) {
    console.info("[Notion] Not ready to sync: session not present");
    return;
  }
  addHandler(startNotionSync());
}

function startFigmaIfReady() {
  if (!isFigmaReadyToSync()) {
    console.info("[Figma] Not ready to sync: session not present");
    return;
  }
  startFigmaSync();
}

export function initializeServiceSync() {
  workerSyncStart.handle(async (isAbleToStart: boolean) => {
    if (!isAbleToStart) {
      return;
    }
    startNotionIfReady();
    startFigmaIfReady();
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

// This assumes that the db / user threads are ready
// Use full when initializing service right after login into them
export function tryInitializeServiceSync(name: "notion" | "figma") {
  console.info(`Attempting to initialize ${name} sync`);
  if (name === "notion") {
    startNotionIfReady();
  }
  if (name === "figma") {
    startFigmaIfReady();
  }
}
