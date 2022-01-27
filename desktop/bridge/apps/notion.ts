import { createChannelBridge } from "@aca/desktop/bridge/base/channels";
import { Notification, Notification_Notion_Commented, Notification_Notion_User_Mentioned } from "@aca/gql";

export type NotionNotificationPartial = Omit<Notification, "resolved_at" | "user_id" | "__typename" | "slack_mention">;
export type NotificationNotionUserMentionedPartial = Omit<
  Notification_Notion_User_Mentioned,
  "__typename" | "id" | "notification"
>;

export type NotificationNotionCommentedPartial = Omit<
  Notification_Notion_Commented,
  "__typename" | "id" | "notification"
>;

export type NotionWorkerSync = {
  notification: NotionNotificationPartial;
  userMentioned?: NotificationNotionUserMentionedPartial;
  commented?: NotificationNotionCommentedPartial;
}[];

export const notionSyncPayload = createChannelBridge<NotionWorkerSync>("notion-worker-sync");
