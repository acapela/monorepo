import { LogEntry, getAllLogsBridge, logStorage } from "@aca/desktop/bridge/logger";

const allLogs: LogEntry[] = [];

export function initializeLogger() {
  logStorage.subscribe((entry) => {
    allLogs.push(entry);
  });

  getAllLogsBridge.handle(async () => {
    return allLogs.map((log) => ({ ...log }));
  });
}
