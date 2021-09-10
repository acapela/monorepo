import { gql } from "@apollo/client";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

import { withFragments } from "~frontend/gql/utils";
import { routes } from "~frontend/router";
import {
  NotificationLabel_NotificationFragment,
  NotificationLabel_RoomFragment,
  NotificationLabel_TopicFragment,
  NotificationPlainLabel_UserFragment,
} from "~gql";

import { NotificationPlainLabel } from "./NotificationPlainLabel";

const fragments = {
  notification: gql`
    ${NotificationPlainLabel.fragments.notification}
    ${NotificationPlainLabel.fragments.user}

    fragment NotificationLabel_room on room {
      id
      space_id
      name
    }

    fragment NotificationLabel_topic on topic {
      id
      name
      room {
        ...NotificationLabel_room
      }
    }

    fragment NotificationLabel_user on user {
      id
      name
      ...NotificationPlainLabel_user
    }

    fragment NotificationLabel_notification on notification {
      ...NotificationPlainLabel_notification

      topic_mention {
        topic {
          ...NotificationLabel_topic
        }
        mentioned_by_user {
          ...NotificationLabel_user
        }
      }

      topic_closed {
        topic {
          ...NotificationLabel_topic
        }
        closed_by_user {
          ...NotificationLabel_user
        }
      }

      topic_assigned {
        topic {
          ...NotificationLabel_topic
        }
        assigned_by_user {
          ...NotificationLabel_user
        }
      }

      topic_added_to {
        topic {
          ...NotificationLabel_topic
        }
        added_by_user {
          ...NotificationLabel_user
        }
      }

      room_closed {
        room {
          ...NotificationLabel_room
        }

        closed_by_user {
          ...NotificationLabel_user
        }
      }

      room_added_to {
        room {
          ...NotificationLabel_room
        }

        added_by_user {
          ...NotificationLabel_user
        }
      }
    }
  `,
};

interface Props {
  notification: NotificationLabel_NotificationFragment;
}

function getNotificationData(notification: NotificationLabel_NotificationFragment):
  | (({ room: NotificationLabel_RoomFragment } | { topic: NotificationLabel_TopicFragment }) & {
      user: NotificationPlainLabel_UserFragment;
      titleNode: React.ReactNode;
    })
  | undefined {
  if (notification.room_added_to) {
    const { room, added_by_user: user } = notification.room_added_to;
    return {
      room,
      user,
      titleNode: (
        <>
          <strong>{user.name}</strong> added you to the room <strong>{room.name}</strong>
        </>
      ),
    };
  }
  if (notification.room_closed) {
    const { room, closed_by_user: user } = notification.room_closed;
    return {
      room,
      user,
      titleNode: (
        <>
          <strong>{user.name}</strong> closed the room <strong>{room.name}</strong>
        </>
      ),
    };
  }
  if (notification.topic_added_to) {
    const { topic, added_by_user: user } = notification.topic_added_to;
    return {
      topic,
      user,
      titleNode: (
        <>
          <strong>{user.name}</strong> added you to the topic <strong>{topic.name}</strong>
        </>
      ),
    };
  }
  if (notification.topic_assigned) {
    const { topic, assigned_by_user: user } = notification.topic_assigned;
    return {
      topic,
      user,
      titleNode: (
        <>
          <strong>{user.name}</strong> assigned you the topic <strong>{topic.name}</strong>
        </>
      ),
    };
  }
  if (notification.topic_mention) {
    const { topic, mentioned_by_user: user } = notification.topic_mention;
    return {
      topic,
      user,
      titleNode: (
        <>
          <strong>{user.name}</strong> mentioned you in the topic <strong>{topic.name}</strong>
        </>
      ),
    };
  }
  if (notification.topic_closed) {
    const { topic, closed_by_user: user } = notification.topic_closed;
    return {
      topic,
      user,
      titleNode: (
        <>
          <strong>{user.name}</strong> closed the topic <strong>{topic.name}</strong>
        </>
      ),
    };
  }
}

export const NotificationLabel = withFragments(fragments, ({ notification }: Props) => {
  const data = getNotificationData(notification);

  if (!data) {
    const error = new Error("could not get data from notification: " + JSON.stringify(notification));
    console.error(error);
    Sentry.captureException(error);
    return null;
  }

  const { user, titleNode } = data;
  const url =
    "topic" in data
      ? routes.spaceRoomTopic.getUrlWithParams({
          spaceId: data.topic.room.space_id,
          roomId: data.topic.room.id,
          topicId: data.topic.id,
        })
      : routes.spaceRoom.getUrlWithParams({ spaceId: data.room.space_id, roomId: data.room.id });

  return (
    <Link href={url}>
      <NotificationPlainLabel {...{ notification, user }}>{titleNode}</NotificationPlainLabel>
    </Link>
  );
});
