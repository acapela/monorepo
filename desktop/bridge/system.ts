import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

import { PublicErrorData } from "../domains/errors/types";
import { createChannelBridge } from "./base/channels";
import { createInvokeBridge } from "./base/invoke";
import { createBridgeValue } from "./base/persistance";

export const restartAppRequest = createInvokeBridge("restart-app");
export const clearAllDataRequest = createInvokeBridge("clear-all-data");
export const toggleMaximizeRequest = createInvokeBridge("toggle-maximize");
export const toggleFullscreenRequest = createInvokeBridge("toggle-fullscreen");
export const toggleDevtoolsRequest = createInvokeBridge<boolean>("toggle-devtools");
export const appUpdateAndRestartRequest = createInvokeBridge("update-and-restart");
export const checkForUpdatesRequest = createInvokeBridge("check-for-updates");
export const setBadgeCountRequest = createInvokeBridge<number>("set-badge-count");
export const showErrorToUserChannel = createChannelBridge<PublicErrorData>("show-error-to-user");
export const showMainWindowRequest = createInvokeBridge("show-main-window");

export const openLinkRequest = createInvokeBridge<{ url: string }>("open-link");

export const applicationStateBridge = createBridgeValue("application-state", {
  getDefault: () => ({
    // Note: as we have browser view, focus 'true' does not mean our React app has focus
    isFocused: false,
    isFullscreen: false,
    isUpdateReadyToInstall: false,
    updateDownloadingPercent: null as number | null,
  }),
});

export const applicationWideSettingsBridge = createBridgeValue("app-wide-settings", {
  isPersisted: true,
  getDefault: () => ({
    globalShowAppShortcut: ["Meta", "Shift", "A"] as ShortcutKeys | null,
    globalPeekShortcut: null as ShortcutKeys | null,
  }),
});
