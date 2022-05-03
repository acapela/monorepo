import { NotificationInner } from "@aca/desktop/clientdb/notification";
import { DesktopNotificationFragment } from "@aca/gql";

import { createChannelBridge } from "./base/channels";

interface NotificationResolvedEventData {
  notification: DesktopNotificationFragment;
  inner: NotificationInner;
}

export const notificationResolvedChannel = createChannelBridge<NotificationResolvedEventData>("notification-resolved");

export const notionNotificationResolvedChannel =
  createChannelBridge<{ space_id?: string | null; notion_original_notification_id: string }>(
    "notion-notification-resolved"
  );
