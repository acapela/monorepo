export interface AppEnvData {
  appName: string;
  version: string;
  isDev: boolean;
  sentryDsn: string;
  initialPersistedValues: Record<string, unknown>;
}
