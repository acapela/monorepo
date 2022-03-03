import { createBridgeValue } from "./base/persistance";

interface UISettings {
  theme: "auto" | "light" | "dark";
}

export const uiSettingsBridge = createBridgeValue<UISettings>("ui-settings", {
  getDefault: () => ({ theme: "auto" }),
  isPersisted: true,
});
