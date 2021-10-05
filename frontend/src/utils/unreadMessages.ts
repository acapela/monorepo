import { gql } from "@apollo/client";
import { memoize } from "lodash";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { createQuery } from "~frontend/gql/utils";
import { UnreadMessageFragmentFragment, UserUnreadMessagesQuery, UserUnreadMessagesQueryVariables } from "~gql";
import { createChannel } from "~shared/channel";
import { onDocumentReady } from "~shared/document";

/**
 * The goal of this module is to provide unread message count hooks for any topic
 *
 * It is constructed in a way that there is only one actual subscription listening to all user unread info.
 *
 * This 'master info' is then properly 'distributed' to scoped hooks of topics
 */

const UnreadMessageFragment = () => gql`
  fragment UnreadMessageFragment on unread_messages {
    topicId: topic_id
    unreadMessages: unread_messages
  }
`;

function getTopicUnreadMessagesCount(unreadData: UnreadMessageFragmentFragment[], topicId: string): number {
  const topicUnreadData = unreadData.find((unread) => unread.topicId === topicId);

  return topicUnreadData?.unreadMessages ?? 0;
}

export const [, { subscribe: subscribeToUnreadMessages }] = createQuery<
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
