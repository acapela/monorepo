import { createChannelBridge } from "./base/channels";
import { createInvokeBridge } from "./base/invoke";

export type Severity = "Error" | "Warning" | "Info" | "Debug";

export interface LogEntry {
  id: string;
  prefix: string;
  severity: Severity;
  timestamp: string;
  text: string;
}

export const logStorage = createChannelBridge<LogEntry>("log-storage");

export const getAllLogsBridge = createInvokeBridge<void, LogEntry[]>("get-all-logs");
