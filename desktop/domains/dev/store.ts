import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

export const devSettingsStore = createMobxPersistedStore("dev-settings", {
  debugFocus: false,
});
