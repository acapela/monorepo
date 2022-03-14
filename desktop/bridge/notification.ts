import { NotificationInner } from "@aca/desktop/clientdb/notification";
import { DesktopNotificationFragment } from "@aca/gql";

import { createChannelBridge } from "./base/channels";
import { createBridgeValue } from "./base/persistance";

interface NotificationResolvedEventData {
  notification: DesktopNotificationFragment;
  inner: NotificationInner;
}

export const notificationResolvedChannel = createChannelBridge<NotificationResolvedEventData>("notification-resolved");

export const preloadingNotificationsBridgeChannel = createBridgeValue("preloadingNotifications", {
  getDefault() {
    return {} as Record<string, "loading" | "ready" | "error">;
  },
});
