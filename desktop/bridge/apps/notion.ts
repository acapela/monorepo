import { createChannelBridge } from "@aca/desktop/bridge/base/channels";
import { Notification, Notification_Notion_User_Mentioned } from "@aca/gql";

export type NotionNotificationPartial = Omit<Notification, "resolved_at" | "user_id" | "__typename">;
export type NotificationNotionUserMentionedPartial = Omit<
  Notification_Notion_User_Mentioned,
  "__typename" | "id" | "notification"
>;

export interface NotionWorkerSync {
  notification: NotionNotificationPartial[];
  userMentionedNotification: NotificationNotionUserMentionedPartial[];
}

export const notionSyncPayload = createChannelBridge<NotionWorkerSync>("notion-worker-sync");
