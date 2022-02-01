import { forceWorkerSyncRun, workerSyncStart } from "@aca/desktop/bridge/apps";
import { appState } from "@aca/desktop/electron/appState";
import { autorunEffect } from "@aca/shared/mobxUtils";

import { initializeFigmaPush } from "./figma/push";
import { isFigmaReadyToSync, startFigmaSync } from "./figma/worker";
import { isNotionReadyToSync, startNotionSync } from "./notion/worker";
import { ServiceSyncController, WorkerService } from "./types";

interface Handler {
  serviceName: WorkerService;
  action: () => void;
}

const onWindowsFocusHandlers: Array<Handler> = [];
const onWindowsBlurHandlers: Array<Handler> = [];
const onForcedRunHandlers: Array<Handler> = [];

function addHandler({ serviceName, onWindowBlur, onWindowFocus, forceSync }: ServiceSyncController) {
  onWindowsFocusHandlers.push({ serviceName, action: onWindowFocus });
  onWindowsBlurHandlers.push({ serviceName, action: onWindowBlur });
  onForcedRunHandlers.push({ serviceName, action: forceSync });
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
  initializeFigmaPush();
}

export function initializeServiceSync() {
  workerSyncStart.handle(async (isAbleToStart: boolean) => {
    if (!isAbleToStart) {
      return;
    }
    startNotionIfReady();
    startFigmaIfReady();
  });

  forceWorkerSyncRun.handle(async (workersToForce: WorkerService[]) => {
    onForcedRunHandlers.forEach((handler) => {
      if (workersToForce.includes(handler.serviceName)) {
        handler.action();
      }
    });
  });

  function handleWindowFocus() {
    onWindowsFocusHandlers.forEach((handler) => handler.action());
  }

  function handleWindowBlur() {
    onWindowsBlurHandlers.forEach((handler) => handler.action());
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
