import { createChannelBridge } from "@aca/desktop/bridge/base/channels";
import { Notification, Notification_Figma_Comment } from "@aca/gql";

export type FigmaNotificationPartial = Omit<Notification, "id" | "resolved_at" | "user_id" | "__typename">;
export type NotificationFigmaCommentPartial = Omit<
  Notification_Figma_Comment,
  "__typename" | "id" | "notification" | "notification_id"
>;

export type FigmaWorkerSync = {
  notification: FigmaNotificationPartial;
  commentNotification?: NotificationFigmaCommentPartial;
}[];

export const figmaSyncPayload = createChannelBridge<FigmaWorkerSync>("figma-worker-sync");
