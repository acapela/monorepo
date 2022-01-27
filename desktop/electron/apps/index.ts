import { workerSyncStart } from "@aca/desktop/bridge/apps";

import { startNotionSync } from "./notion/worker";

export type NotificationServiceName = "notion";

const onWindowsFocusHandlers: Array<() => void> = [];
const onWindowsBlurHandlers: Array<() => void> = [];

function addHandler(controller: ServiceSyncController) {
  onWindowsFocusHandlers.push(controller.onWindowFocus);
  onWindowsBlurHandlers.push(controller.onWindowBlur);
}

export function initializeServiceSync(): ServiceSyncController {
  workerSyncStart.handle(async (isAbleToStart: boolean) => {
    if (isAbleToStart) {
      addHandler(startNotionSync());
    }
  });
  return {
    onWindowFocus() {
      onWindowsFocusHandlers.forEach((handler) => handler());
    },
    onWindowBlur() {
      onWindowsBlurHandlers.forEach((handler) => handler());
    },
  };
}

export interface ServiceSyncController {
  onWindowFocus: () => void;
  onWindowBlur: () => void;
}
