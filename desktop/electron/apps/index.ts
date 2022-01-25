import { startNotionSync } from "./notion/worker";

export type NotificationServiceName = "notion";

export function initializeServiceSync(): ServiceSyncController {
  return startNotionSync();
}

export interface ServiceSyncController {
  onWindowFocus: () => void;
  onWindowBlur: () => void;
}
