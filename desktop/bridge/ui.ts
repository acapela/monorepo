import { createBridgeValue } from "./base/persistance";

interface UISettings {
  isDarkMode: boolean;
}

export const uiSettingsBridge = createBridgeValue<UISettings>("ui-settings", {
  getDefault: () => ({ isDarkMode: false }),
  isPersisted: true,
});
