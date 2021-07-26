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

export type NotificationData<Type extends NotificationType> = {
  type: Type;
  data: NotificationTypesMap[Type];
};

export function createNotificationData<Type extends NotificationType>(
  type: Type,
  data: NotificationTypesMap[Type]
): NotificationData<Type> {
  return {
    type,
    data,
  };
}

export function isNotificationDataOfType<Type extends NotificationType>(
  data: NotificationData<NotificationType>,
  type: Type
): data is NotificationData<Type> {
  return data.type === type;
}
