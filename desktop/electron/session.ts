import { session } from "electron";

export function initializeDefaultSession() {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    // Electron allows all permissions by default, we only want to let the ones through that could be useful within
    // embeds, like voice/screen-recording. We specifically do not want to allow "notifications" as those would
    // create native notifications.
    const ALLOWED_PERMISSIONS: typeof permission[] = ["display-capture", "media"];
    callback(ALLOWED_PERMISSIONS.includes(permission));
  });
}
