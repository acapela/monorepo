type WindowName = "Root" | "Logger";

export interface AppEnvData {
  appName: string;
  version: string;
  isDev: boolean;
  sentryDsn: string;
  windowName?: WindowName;
}
