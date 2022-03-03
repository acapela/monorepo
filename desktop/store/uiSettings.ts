import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

/**
 * Store holding global state of the UI
 */
export const uiSettings = createMobxPersistedStore("ui-settings", {
  showFocusModeStats: false,
});
