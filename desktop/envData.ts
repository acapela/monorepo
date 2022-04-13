export interface AppEnvData {
  appName: string;
  version: string;
  isDev: boolean;
  initialPersistedValues: Record<string, unknown>;
}
