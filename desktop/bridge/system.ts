import { PublicErrorData } from "@aca/desktop/domains/errors/types";
import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

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
export const setBadgeCountRequest = createInvokeBridge<number | string>("set-badge-count");
export const showErrorToUserChannel = createChannelBridge<PublicErrorData>("show-error-to-user");
export const showMainWindowRequest = createInvokeBridge("show-main-window");
export const waitForDoNotDisturbToFinish = createInvokeBridge("wait-for-do-not-disturb-to-finish");
export const focusMainViewRequest = createInvokeBridge("focusMainViewRequest");
export const focusSenderViewRequest = createInvokeBridge("focusSenderViewRequest");

export const openLinkRequest = createInvokeBridge<{ url: string }>("open-link");

export const applicationStateBridge = createBridgeValue("application-state", {
  getDefault: () => ({
    // Note: as we have browser view, focus 'true' does not mean our React app has focus
    isFocused: true,
    isFullscreen: false,
    isUpdateReadyToInstall: false,
    updateDownloadingPercent: null as number | null,
  }),
});

export const applicationFocusStateBridge = createBridgeValue("application-focus-state", {
  getDefault: () => ({
    // Note: as we have browser view, focus 'true' does not mean our React app has focus
    lastAppFocusDateTs: Date.now(),
    lastAppBlurredDateTs: Date.now(),
  }),
});

export const applicationWideSettingsBridge = createBridgeValue("app-wide-settings", {
  isPersisted: true,
  getDefault: () => ({
    globalShowAppShortcut: ["Meta", "Shift", "A"] as ShortcutKeys | null,
    globalPeekShortcut: null as ShortcutKeys | null,
    enableDesktopNotifications: true,
    showNotificationsCountBadge: true,
    notificationsCountBadgeListIds: [] as string[],
    showShortcutsBar: true,
  }),
});
