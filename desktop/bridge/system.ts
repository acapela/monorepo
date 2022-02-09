import { createInvokeBridge } from "./base/invoke";
import { createBridgeValue } from "./base/persistance";

export const restartAppRequest = createInvokeBridge("restart-app");
export const clearAllDataRequest = createInvokeBridge("clear-all-data");
export const toggleMaximizeRequest = createInvokeBridge("toggle-maximize");
export const toggleFullscreenRequest = createInvokeBridge("toggle-fullscreen");
export const toggleDevtoolsRequest = createInvokeBridge<boolean>("toggle-devtools");

export const openLinkRequest = createInvokeBridge<{ url: string }>("open-link");

export const applicationStateBridge = createBridgeValue("application-state", {
  getDefault: () => ({
    // Note: as we have browser view, focus 'true' does not mean our React app has focus
    isFocused: false,
    isFullscreen: false,
    isUpdateAvaliable: false,
  }),
});

export const applicationWideSettingsBridge = createBridgeValue("app-wide-settings", {
  isPersisted: true,
  getDefault: () => ({
    globalShowAppShortcut: "CommandOrControl+Shift+A" as string | null,
  }),
});
