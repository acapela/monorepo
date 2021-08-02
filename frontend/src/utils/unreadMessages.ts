import { gql } from "@apollo/client";
import { memoize } from "lodash";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { createQuery } from "~frontend/gql/utils";
import {
  RoomBasicInfoFragment,
  TopicDetailedInfoFragment,
  UnreadMessageFragmentFragment,
  UserUnreadMessagesQuery,
  UserUnreadMessagesQueryVariables,
} from "~gql";
import { createChannel } from "~shared/channel";
import { onDocumentReady } from "~shared/document";

/**
 * The goal of this module is to provide unread message count hooks for any space, room or topic
 *
 * It is constructed in a way that there is only one actual subscription listening to all user unread info.
 *
 * This 'master info' is then properly 'distributed' to scoped hooks of spaces/topics/rooms.
 */

const UnreadMessageFragment = () => gql`
  fragment UnreadMessageFragment on unread_messages {
    roomId: room_id
    topicId: topic_id
    unreadMessages: unread_messages
  }
`;

function countRoomUnreadMessages(unreadData: UnreadMessageFragmentFragment[], roomId: string) {
  let count = 0;

  for (const unread of unreadData) {
    if (unread.roomId === roomId) {
      count += unread.unreadMessages ?? 0;
    }
  }

  return count;
}

function getTopicUnreadMessagesCount(unreadData: UnreadMessageFragmentFragment[], topicId: string): number {
  const topicUnreadData = unreadData.find((unread) => unread.topicId === topicId);

  return topicUnreadData?.unreadMessages ?? 0;
}

const [, { subscribe: subscribeToUnreadMessages }] = createQuery<
  UserUnreadMessagesQuery,
  UserUnreadMessagesQueryVariables
>(
  () => gql`
    ${UnreadMessageFragment()}
    query UserUnreadMessages($userId: uuid) {
      messages: unread_messages(where: { user_id: { _eq: $userId } }) {
        ...UnreadMessageFragment
      }
    }
  `
);

/**
 * Memoize channel of unread info data per-user so we only have one subscription running per user
 *
 * TODO: Make sure it clears properly during hot-reloading in dev mode
 */
const getUserUnreadMessagesChannel = memoize((userId: string) => {
  const channel = createChannel<UnreadMessageFragmentFragment[]>();

  onDocumentReady(() => {
    subscribeToUnreadMessages({ userId }, (data) => {
      channel.publish(data.messages);
    });
  });

  return channel;
});

const getRoomUnreadMessagesChannel = memoize(
  (userId: string, roomId: string) => {
    const channel = createChannel<number>();

    const userChannel = getUserUnreadMessagesChannel(userId);

    userChannel.subscribe((listOfUnreadInfo) => {
      const roomUnreadCount = countRoomUnreadMessages(listOfUnreadInfo, roomId);

      channel.publish(roomUnreadCount);
    });

    return channel;
  },
  // lodash memoize requires custom arguments serializer if function accepts more than one argument https://github.com/lodash/lodash/issues/2115
  (...args) => JSON.stringify(args)
);

const getTopicUnreadMessagesChannel = memoize(
  (userId: string, topicId: string) => {
    const channel = createChannel<number>();

    const userChannel = getUserUnreadMessagesChannel(userId);

    userChannel.subscribe((listOfUnreadInfo) => {
      const topicUnreadCount = getTopicUnreadMessagesCount(listOfUnreadInfo, topicId);

      channel.publish(topicUnreadCount);
    });

    return channel;
  },
  // lodash memoize requires custom arguments serializer if function accepts more than one argument https://github.com/lodash/lodash/issues/2115
  (...args) => JSON.stringify(args)
);

export function useTopicUnreadMessagesCount(topicId: string) {
  const user = useAssertCurrentUser();

  return getTopicUnreadMessagesChannel(user.id, topicId).useLastValue() ?? 0;
}

export function useRoomUnreadMessagesCount(roomId: string) {
  const user = useAssertCurrentUser();

  return getRoomUnreadMessagesChannel(user.id, roomId).useLastValue() ?? 0;
}

type DetailedRoomMessages = Record<TopicDetailedInfoFragment["id"], number>;

export function useDetailedRoomMessagesCount(roomId: string): DetailedRoomMessages {
  const user = useAssertCurrentUser();

  const allMessages = getUserUnreadMessagesChannel(user.id).useLastValue() ?? [];

  const detailedRoomMessages: UnreadRoomMessage = {};

  allMessages.forEach((message) => {
    if (!message.roomId || !message.topicId || message.roomId !== roomId) {
      return;
    }
    detailedRoomMessages[message.topicId] = message.unreadMessages ?? 0;
  });

  return detailedRoomMessages;
}

export type UnreadRoomMessage = Record<RoomBasicInfoFragment["id"], number>;

export function useTeamRoomsMessagesCount(): UnreadRoomMessage {
  const user = useAssertCurrentUser();

  const allMessages = getUserUnreadMessagesChannel(user.id).useLastValue() ?? [];

  const roomsMessages: UnreadRoomMessage = {};

  allMessages.forEach((message) => {
    if (!message.roomId) {
      return;
    }

    if (!roomsMessages[message.roomId]) {
      roomsMessages[message.roomId] = 0;
    }

    roomsMessages[message.roomId] += message.unreadMessages ?? 0;
  });

  return roomsMessages;
}
