import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import { orderBy } from "lodash";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  DashboardOpenTopicFragment,
  DashboardOpenTopicsSubscription,
  DashboardOpenTopicsSubscriptionVariables,
} from "~gql";

import { DashboardTopicCard } from "./TopicCard";

const getTopicLastMessageTimestamp = (topic: DashboardOpenTopicFragment) => {
  const date = topic.lastMessage.aggregate?.max?.updated_at;
  return date ? new Date(date).getTime() : null;
};

const getTopicLastSeenMessageTimestamp = (topic: DashboardOpenTopicFragment) => {
  const [message] = topic.last_seen_messages;
  return message ? new Date(message.seen_at).getTime() : null;
};

const getTopicLastUnreadMessageTimestamp = (topic: DashboardOpenTopicFragment): number | null => {
  const lastMessageTimestamp = getTopicLastMessageTimestamp(topic);
  if (!lastMessageTimestamp) return null;

  const lastSeenMessageTimestamp = getTopicLastSeenMessageTimestamp(topic);
  const hasUnreadMessage = !lastSeenMessageTimestamp || lastSeenMessageTimestamp < lastMessageTimestamp;

  return hasUnreadMessage ? lastMessageTimestamp : null;
};

export const useDashboardOpenTopics = () => {
  const teamId = useAssertCurrentTeamId();
  const currentUser = useAssertCurrentUser();

  const { data } = useSubscription<DashboardOpenTopicsSubscription, DashboardOpenTopicsSubscriptionVariables>(
    gql`
      ${DashboardTopicCard.fragments.topic}

      fragment DashboardOpenTopic on topic {
        ...DashboardTopicCard_topic
        id
        last_seen_messages {
          seen_at
        }
        lastMessage: messages_aggregate {
          aggregate {
            max {
              updated_at
            }
          }
        }
      }

      subscription DashboardOpenTopics($teamId: uuid!, $userId: uuid!) {
        topic(
          where: {
            team_id: { _eq: $teamId }
            closed_at: { _is_null: true }
            _not: {
              messages: {
                tasks: {
                  done_at: { _is_null: true }
                  _or: [{ user_id: { _eq: $userId } }, { message: { user_id: { _eq: $userId } } }]
                }
              }
            }
          }
          order_by: { updated_at: desc }
        ) {
          ...DashboardOpenTopic
        }
      }
    `,
    { variables: { teamId, userId: currentUser.id } }
  );

  const topics = data?.topic || [];

  return orderBy(topics, (topic) => [getTopicLastUnreadMessageTimestamp(topic), getTopicLastMessageTimestamp(topic)], [
    "desc",
    "desc",
  ]);
};
