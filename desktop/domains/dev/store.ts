import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

export const devSettingsStore = createMobxPersistedStore("dev-settings", {
  debugFocus: false,
  showLogsWindow: false,
  debugPreloading: false,
  hidePreviews: false,
  devMode: false,
});
