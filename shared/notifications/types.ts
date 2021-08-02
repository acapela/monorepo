export interface NotificationTypesMap {
  topicMention: {
    topicId: string;
    mentionedByUserId: string;
  };
  topicClosed: {
    topicId: string;
    closedByUserId: string;
  };
  roomClosed: {
    roomId: string;
    closedByUserId: string;
  };
  addedToRoom: {
    roomId: string;
    addedByUserId: string;
  };
  addedToTopic: {
    topicId: string;
    addedByUserId: string;
  };
}

export type NotificationType = keyof NotificationTypesMap;

export type NotificationPayload<Type extends NotificationType> = NotificationTypesMap[Type];

export type NotificationData<Type extends NotificationType> = {
  type: Type;
  payload: NotificationPayload<Type>;
};

export type AnyNotificationData = NotificationData<NotificationType>;

export function createNotificationData<Type extends NotificationType>(
  type: Type,
  payload: NotificationTypesMap[Type]
): NotificationData<Type> {
  return {
    type,
    payload,
  };
}

export function isNotificationDataOfType<Type extends NotificationType>(
  data: NotificationData<NotificationType>,
  type: Type
): data is NotificationData<Type> {
  return data.type === type;
}
