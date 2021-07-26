import { ComponentType } from "react";
import { NotificationInfoFragment } from "~frontend/../../gql";
import { routes } from "~frontend/../routes";
import { useCurrentTeamMember } from "~frontend/gql/teams";
import { useSingleTopicQuery } from "~frontend/gql/topics";
import {
  AnyNotificationData,
  isNotificationDataOfType,
  NotificationType,
  NotificationData,
  NotificationTypesMap,
} from "~shared/notifications/types";
import { NotificationPlainLabel } from "./NotificationPlainLabel";

interface Props {
  notification: NotificationInfoFragment;
}

interface NotificationTypeComponentProps<T extends NotificationType> {
  notification: NotificationInfoFragment;
  data: NotificationTypesMap[T];
}

function createNotificationTypeComponent<T extends NotificationType>(
  type: T,
  Component: ComponentType<NotificationTypeComponentProps<T>>
): ComponentType<Props> {
  return function NotificationTypeComponent({ notification }: Props) {
    const notificationData = notification.data as AnyNotificationData;
    if (!isNotificationDataOfType(notificationData, type)) {
      return null;
    }

    return <Component notification={notification} data={notificationData.data} />;
  };
}

const MentionNotificationLabel = createNotificationTypeComponent(
  "topicMention",
  ({ notification, data: { mentionedByUserId, topicId } }) => {
    const [topic] = useSingleTopicQuery({ id: topicId });
    const mentioningUser = useCurrentTeamMember(mentionedByUserId);

    if (!topic || !mentioningUser) return null;

    return (
      <NotificationPlainLabel
        notification={notification}
        id={notification.id}
        date={new Date(notification.created_at)}
        titleNode={
          <>
            <strong>{mentioningUser.name}</strong> mentioned you in the topic <strong>{topic.name}</strong>
          </>
        }
        userId={mentionedByUserId}
        onClick={() => {
          routes.spaceRoomTopic.push({ topicId, spaceId: topic.room.space_id, roomId: topic.room.id });
        }}
      />
    );
  }
);

export function NotificationLabel({ notification }: Props) {
  const notificationData = notification.data as AnyNotificationData;
  if (isNotificationDataOfType(notificationData, "topicMention")) {
    return <MentionNotificationLabel notification={notification} />;
  }

  return null;
}
