import { forceWorkerSyncRun, workerSyncStart } from "@aca/desktop/bridge/apps";

import { getMainWindow } from "../windows/mainWindow";
import { initializeFigmaPush } from "./figma/push";
import { isFigmaReadyToSync, startFigmaSync } from "./figma/worker";
import { initializeNotionPush } from "./notion/push";
import { isNotionReadyToSync, startNotionSync } from "./notion/worker";
import { ServiceSyncController, WorkerService } from "./serviceSyncController";

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
  initializeNotionPush();
}

function startFigmaIfReady() {
  if (!isFigmaReadyToSync()) {
    console.info("[Figma] Not ready to sync: session not present");
    return;
  }
  addHandler(startFigmaSync());
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

  const mainWindow = getMainWindow();

  mainWindow.on("blur", handleWindowBlur);
  mainWindow.on("focus", handleWindowFocus);

  return () => {
    mainWindow.off("blur", handleWindowBlur);
    mainWindow.off("focus", handleWindowFocus);
  };
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
