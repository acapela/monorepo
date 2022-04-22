import { createBridgeValue } from "./base/persistance";

export type AppTheme = "auto" | "light" | "dark";
interface UISettings {
  theme: AppTheme;
}

export const uiSettingsBridge = createBridgeValue<UISettings>("ui-settings", {
  getDefault: () => ({ theme: "auto" }),
  isPersisted: true,
});
