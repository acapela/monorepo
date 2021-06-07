import { gql } from "@apollo/client";
import { memoize } from "lodash";
import { useEffect, useState } from "react";
import { createCleanupObject } from "~shared/cleanup";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  UnreadMessageFragmentFragment,
  UserUnreadMessagesQuery,
  UserUnreadMessagesQueryVariables,
} from "~frontend/gql/generated";
import { useGetSpaceRoomsQuery } from "~frontend/gql/rooms";
import { createQuery } from "~frontend/gql/utils";
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
      count += unread.unreadMessages;
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

/**
 * TODO: It might possibly be solved at SQL view level. Now it is a proxy hook that just adds up count of all rooms in
 * a space.
 */
export function useSpaceUnreadMessagesCount(spaceId: string) {
  const [count, setCount] = useState(0);
  const user = useAssertCurrentUser();

  // Get all rooms of a space so we can add up theirs unread counts
  const [rooms] = useGetSpaceRoomsQuery({ spaceId });

  const roomIds: string[] = rooms?.room.map((room) => room.id) ?? [];

  useEffect(() => {
    function getSpaceUnreadCount() {
      const roomsUnreadCounts = roomIds.map((roomId) => {
        return getRoomUnreadMessagesChannel(user.id, roomId).getLastValue() ?? 0;
      });

      return addArrayOfNumbers(roomsUnreadCounts);
    }

    function updateCurrentCount() {
      setCount(getSpaceUnreadCount());
    }

    const cleanup = createCleanupObject();

    roomIds.forEach((roomId) => {
      const stopListeningForRoomUnreadsChanges = getRoomUnreadMessagesChannel(user.id, roomId).subscribe(
        updateCurrentCount
      );

      cleanup.enqueue(stopListeningForRoomUnreadsChanges);
    });

    return cleanup.clean;
  }, [
    // React useEffect deps list require constant length of deps list, therefore we join all the ids.
    roomIds.join("-"),
    user.id,
  ]);

  return count;
}

function addArrayOfNumbers(numbers: number[]) {
  let count = 0;

  for (const number of numbers) {
    count += number;
  }

  return count;
}
