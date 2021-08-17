import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useCurrentTeamMember } from "~frontend/gql/teams";
import { useSingleTopicQuery } from "~frontend/gql/topics";
import { RouteLink, routes } from "~frontend/router";
import { NotificationInfoFragment } from "~gql";
import {
  AnyNotificationData,
  NotificationType,
  NotificationTypesMap,
  isNotificationDataOfType,
} from "~shared/notifications/types";

import { NotificationPlainLabel } from "./NotificationPlainLabel";
import { useRemoveIncorrectNotification } from "./useRemoveIncorrectNotification";

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

  if (isNotificationDataOfType(notificationData, "topicAssigned")) {
    return <TopicAssignedNotificationLabel notification={notification} payload={notificationData.payload} />;
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

  // TODO: Should we somehow warn about this, especially in production?
  return null;
}

function MentionNotificationLabel({
  payload: { mentionedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"topicMention">) {
  const [topic, { loading: isTopicLoading }] = useSingleTopicQuery({ id: topicId });
  const [mentioningUser, isUserLoading] = useCurrentTeamMember(mentionedByUserId);

  useRemoveIncorrectNotification({
    isLoading: isTopicLoading || isUserLoading,
    shouldRemove: !topic && !mentioningUser,
    notification,
  });

  if (!topic || !mentioningUser) return null;

  return (
    <RouteLink route={routes.spaceRoomTopic} params={{ topicId, spaceId: topic.room.space_id, roomId: topic.room.id }}>
      <NotificationPlainLabel
        notification={notification}
        titleNode={
          <>
            <strong>{mentioningUser.name}</strong> mentioned you in the topic <strong>{topic.name}</strong>
          </>
        }
        userId={mentionedByUserId}
      />
    </RouteLink>
  );
}

function TopicClosedNotificationLabel({
  payload: { closedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"topicClosed">) {
  const [topic, { loading: isTopicLoading }] = useSingleTopicQuery({ id: topicId });
  const [closingUser, isUserLoading] = useCurrentTeamMember(closedByUserId);

  useRemoveIncorrectNotification({
    isLoading: isTopicLoading || isUserLoading,
    shouldRemove: !topic && !closingUser,
    notification,
  });

  if (!topic || !closingUser) return null;

  return (
    <RouteLink route={routes.spaceRoomTopic} params={{ topicId, spaceId: topic.room.space_id, roomId: topic.room.id }}>
      <NotificationPlainLabel
        notification={notification}
        titleNode={
          <>
            <strong>{closingUser.name}</strong> closed the topic <strong>{topic.name}</strong>
          </>
        }
        userId={closedByUserId}
      />
    </RouteLink>
  );
}

function TopicAssignedNotificationLabel({
  payload: { assignedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"topicAssigned">) {
  const [topic, { loading: isTopicLoading }] = useSingleTopicQuery({ id: topicId });
  const [assigningUser, isUserLoading] = useCurrentTeamMember(assignedByUserId);

  useRemoveIncorrectNotification({
    isLoading: isTopicLoading || isUserLoading,
    shouldRemove: !topic && !assigningUser,
    notification,
  });

  if (!topic || !assigningUser) return null;

  return (
    <RouteLink route={routes.spaceRoomTopic} params={{ topicId, spaceId: topic.room.space_id, roomId: topic.room.id }}>
      <NotificationPlainLabel
        notification={notification}
        titleNode={
          <>
            <strong>{assigningUser.name}</strong> assigned you the topic <strong>{topic.name}</strong>
          </>
        }
        userId={assignedByUserId}
      />
    </RouteLink>
  );
}

function AddedToTopicClosedNotificationLabel({
  payload: { addedByUserId, topicId },
  notification,
}: NotificationTypeComponentProps<"addedToTopic">) {
  const [topic, { loading: isTopicLoading }] = useSingleTopicQuery({ id: topicId });
  const [addedByUser, isUserLoading] = useCurrentTeamMember(addedByUserId);

  useRemoveIncorrectNotification({
    isLoading: isTopicLoading || isUserLoading,
    shouldRemove: !topic && !addedByUser,
    notification,
  });

  if (!topic || !addedByUser) return null;

  return (
    <RouteLink route={routes.spaceRoomTopic} params={{ topicId, spaceId: topic.room.space_id, roomId: topic.room.id }}>
      <NotificationPlainLabel
        notification={notification}
        titleNode={
          <>
            <strong>{addedByUser.name}</strong> added you to the topic <strong>{topic.name}</strong>
          </>
        }
        userId={addedByUser.id}
      />
    </RouteLink>
  );
}

function RoomClosedNotificationLabel({
  payload: { closedByUserId, roomId },
  notification,
}: NotificationTypeComponentProps<"roomClosed">) {
  const [room, { loading: isRoomLoading }] = useSingleRoomQuery({ id: roomId });
  const [closingUser, isUserLoading] = useCurrentTeamMember(closedByUserId);

  useRemoveIncorrectNotification({
    isLoading: isRoomLoading || isUserLoading,
    shouldRemove: !room && !closingUser,
    notification,
  });

  // TODO: Sentry - add info in case of incorrect data
  if (!room || !closingUser) return null;

  return (
    <RouteLink route={routes.spaceRoom} params={{ spaceId: room.space_id, roomId: room.id }}>
      <NotificationPlainLabel
        notification={notification}
        titleNode={
          <>
            <strong>{closingUser.name}</strong> closed the room <strong>{room.name}</strong>
          </>
        }
        userId={closedByUserId}
      />
    </RouteLink>
  );
}

function AddedToRoomClosedNotificationLabel({
  payload: { roomId, addedByUserId },
  notification,
}: NotificationTypeComponentProps<"addedToRoom">) {
  const [room, { loading: isRoomLoading }] = useSingleRoomQuery({ id: roomId });
  const [addingUser, isUserLoading] = useCurrentTeamMember(addedByUserId);

  useRemoveIncorrectNotification({
    isLoading: isRoomLoading || isUserLoading,
    shouldRemove: !room && !addingUser,
    notification,
  });

  if (!room || !addingUser) return null;

  return (
    <RouteLink route={routes.spaceRoom} params={{ spaceId: room.space_id, roomId: room.id }}>
      <NotificationPlainLabel
        notification={notification}
        titleNode={
          <>
            <strong>{addingUser.name}</strong> added you to the room <strong>{room.name}</strong>
          </>
        }
        userId={addedByUserId}
      />
    </RouteLink>
  );
}
