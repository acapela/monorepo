import { createChannelBridge } from "@aca/desktop/bridge/base/channels";
import { createSessionBridgeValue } from "@aca/desktop/bridge/base/persistance";
import { Notification, Notification_Notion } from "@aca/gql";

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

export const notionSyncPayload = createChannelBridge<NotionWorkerSync>("notion-worker-sync");

export interface NotionSpace {
  id: string;
  name: string;
}

export const notionSelectedSpaceValue = createSessionBridgeValue<{ selected: string[] }>("notion-selected-spaces", {
  getDefault: () => ({ selected: [] }),
  isPersisted: true,
});

export const notionAvailableSpacesValue = createSessionBridgeValue<{ spaces: NotionSpace[] }>(
  "notion-available-spaces",
  {
    getDefault: () => ({ spaces: [] }),
    isPersisted: true,
  }
);
