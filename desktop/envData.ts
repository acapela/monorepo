type WindowName = "Root" | "Logger";

export interface AppEnvData {
  version: string;
  isDev: boolean;
  sentryDsn: string;
  windowName?: WindowName;
}
