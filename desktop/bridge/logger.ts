import { createChannelBridge } from "./base/channels";
import { createInvokeBridge } from "./base/invoke";

export type Prefix =
  | "Electron-Boot-Sequence"
  | "Notion-Worker"
  | "Figma-Worker"
  | "Worker-Consolidation"
  | "Preview"
  | "Notification-Events"
  | "ClientDb"
  | "BrowserView"
  | "AutoUpdater";

export type Severity = "Error" | "Warning" | "Info" | "Debug";

export interface LogEntry {
  id: string;
  prefix: Prefix;
  severity: Severity;
  timestamp: string;
  text: string;
}

export const logStorage = createChannelBridge<LogEntry>("log-storage");

export const getAllLogsBridge = createInvokeBridge<void, LogEntry[]>("get-all-logs");

export const requestToggleLoggerWindow = createInvokeBridge<void, void>("toggle-logger-window");
