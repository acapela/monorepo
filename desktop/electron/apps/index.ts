import { startNotionSync } from "./notion/worker";

export type NotificationServiceName = "notion";

export function startServiceSync() {
  startNotionSync();
}
