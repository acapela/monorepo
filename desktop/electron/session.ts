import { BrowserWindow, WebContents, session } from "electron";

/**
 * We only allow notifications for app windows (but not for browser views)
 */
function shouldAllowNotifications(webContents: WebContents) {
  return BrowserWindow.getAllWindows().some((window) => {
    return window.webContents === webContents;
  });
}

// prettier-ignore
type Permission = "clipboard-read"| "media"| "display-capture"| "mediaKeySystem"| "geolocation"| "notifications"| "midi"| "midiSysex"| "pointerLock"| "fullscreen"| "openExternal"| "unknown";

const DEFAULTALLOWED_PERMISSIONS: Permission[] = ["display-capture", "media", "fullscreen"];

export function initializeDefaultSession() {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    // Electron allows all permissions by default, we only want to let the ones through that could be useful within
    // embeds, like voice/screen-recording. We specifically do not want to allow "notifications" as those would
    // create native notifications.
    const permissions = [...DEFAULTALLOWED_PERMISSIONS];

    if (shouldAllowNotifications(webContents)) {
      permissions.push("notifications");
    }

    callback(permissions.includes(permission));
  });
}
