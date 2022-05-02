import { Notification_Notion } from "@aca/gql";

export type NotificationPartial = Omit<Notification, "id" | "resolved_at" | "user_id" | "__typename" | "slack_mention">;
export type NotificationNotionPartial = Omit<
  Notification_Notion,
  "id" | "notification" | "notification_id" | "__typename" | "notion_space_id" | "space_id"
> & { synced_spaced_id: string };

export type NotionNotificationType =
  | "notification_notion_user_mentioned"
  | "notification_notion_user_invited"
  | "notification_notion_commented";

export type NotionWorkerSync = {
  notification: NotificationPartial;
  notionNotification: NotificationNotionPartial;
  type: NotionNotificationType;
  discussion_id: string | undefined;
}[];
