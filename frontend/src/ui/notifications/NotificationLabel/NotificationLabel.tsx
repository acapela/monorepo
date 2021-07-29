import { NotificationInfoFragment } from "~gql";
import { routes } from "~frontend/routes";
import { useCurrentTeamMember } from "~frontend/gql/teams";
import { useSingleTopicQuery } from "~frontend/gql/topics";
import {
  AnyNotificationData,
  isNotificationDataOfType,
  NotificationType,
  NotificationTypesMap,
} from "~shared/notifications/types";
import { NotificationPlainLabel } from "./NotificationPlainLabel";
import { useSingleRoomQuery } from "~frontend/gql/rooms";

interface Props {
  notification: NotificationInfoFragment;
}

interface NotificationTypeComponentProps<T extends NotificationType> {
  notification: NotificationInfoFragment;
  payload: NotificationTypesMap[T];
}

export function NotificationLabel({ notification }: Props) {
  const notificationData = notification.data as AnyNotificationData;
  if (isNotificationDataOfType(notificationData, "topicMention")) {
    return <MentionNotificationLabel notification={notification} payload={notificationData.payload} />;
  }

  if (isNotificationDataOfType(notificationData, "topicClosed")) {
    return <TopicClosedNotificationLabel notification={notification} payload={notificationData.payload} />;
  }

  if (isNotificationDataOfType(notificationData, "addedToTopic")) {
    return <AddedToTopicClosedNotificationLabel notification={notification} payload={notificationData.payload} />;
  }

  if (isNotificationDataOfType(notificationData, "roomClosed")) {
    return <RoomClosedNotificationLabel notification={notification} payload={notificationData.payload} />;
  }

  if (isNotificationDataOfType(notificationData, "addedToRoom")) {
    return <AddedToRoomClosedNotificationLabel notification={notification} payload={notificationData.payload} />;
  }

  return null;
}

function MentionNotificationLabel({
  payload: { mentionedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"topicMention">) {
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

function TopicClosedNotificationLabel({
  payload: { closedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"topicClosed">) {
  const [topic] = useSingleTopicQuery({ id: topicId });
  const closingUser = useCurrentTeamMember(closedByUserId);

  if (!topic || !closingUser) return null;

  return (
    <NotificationPlainLabel
      notification={notification}
      id={notification.id}
      date={new Date(notification.created_at)}
      titleNode={
        <>
          <strong>{closingUser.name}</strong> closed the topic <strong>{topic.name}</strong>
        </>
      }
      userId={closedByUserId}
    />
  );
}

function AddedToTopicClosedNotificationLabel({
  payload: { addedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"addedToTopic">) {
  const [topic] = useSingleTopicQuery({ id: topicId });
  const addedByUser = useCurrentTeamMember(addedByUserId);

  if (!topic || !addedByUser) return null;

  return (
    <NotificationPlainLabel
      notification={notification}
      id={notification.id}
      date={new Date(notification.created_at)}
      titleNode={
        <>
          <strong>{addedByUser.name}</strong> added you to the topic <strong>{topic.name}</strong>
        </>
      }
      userId={addedByUser.id}
      onClick={() => {
        routes.spaceRoomTopic.push({ topicId, spaceId: topic.room.space_id, roomId: topic.room.id });
      }}
    />
  );
}

function RoomClosedNotificationLabel({
  payload: { closedByUserId, roomId },
  notification,
}: NotificationTypeComponentProps<"roomClosed">) {
  const [room] = useSingleRoomQuery({ id: roomId });
  const closingUser = useCurrentTeamMember(closedByUserId);

  if (!room || !closingUser) return null;

  return (
    <NotificationPlainLabel
      notification={notification}
      id={notification.id}
      date={new Date(notification.created_at)}
      titleNode={
        <>
          <strong>{closingUser.name}</strong> closed the room <strong>{room.name}</strong>
        </>
      }
      userId={closedByUserId}
    />
  );
}

function AddedToRoomClosedNotificationLabel({
  payload: { roomId, addedByUserId },
  notification,
}: NotificationTypeComponentProps<"addedToRoom">) {
  const [room] = useSingleRoomQuery({ id: roomId });
  const addingUser = useCurrentTeamMember(addedByUserId);

  if (!room || !addingUser) return null;

  return (
    <NotificationPlainLabel
      notification={notification}
      id={notification.id}
      date={new Date(notification.created_at)}
      titleNode={
        <>
          <strong>{addingUser.name}</strong> added you to the room <strong>{room.name}</strong>
        </>
      }
      userId={addedByUserId}
      onClick={() => {
        routes.spaceRoom.push({ spaceId: room.space_id, roomId: room.id });
      }}
    />
  );
}
