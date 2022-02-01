import { createChannelBridge } from "@aca/desktop/bridge/base/channels";
import { createBridgeValue } from "@aca/desktop/bridge/base/persistance";
import { Notification, Notification_Notion } from "@aca/gql";

export type NotificationPartial = Omit<Notification, "id" | "resolved_at" | "user_id" | "__typename" | "slack_mention">;
export type NotificationNotionPartial = Omit<
  Notification_Notion,
  "id" | "notification" | "notification_id" | "__typename"
>;

export type NotionNotificationType =
  | "notification_notion_user_mentioned"
  | "notification_notion_user_invited"
  | "notification_notion_commented";

export type NotionWorkerSync = {
  notification: NotificationPartial;
  notionNotification: NotificationNotionPartial;
  type: NotionNotificationType;
}[];

export const notionSyncPayload = createChannelBridge<NotionWorkerSync>("notion-worker-sync");

interface NotionSpaces {
  selected: string[]; //id
  allSpaces: NotionSpace[];
}

export interface NotionSpace {
  id: string;
  name: string;
}

const DEFAULT_SELECTED_SPACE_VALUE = {
  selected: [],
  allSpaces: [],
};

export const notionSelectedSpaceValue = createBridgeValue<NotionSpaces>("notion-spaces", {
  getDefault: () => DEFAULT_SELECTED_SPACE_VALUE,
  isPersisted: true,
});
