/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from "@apollo/client";

import {
  CreateTopicMutation,
  CreateTopicMutationVariables,
  RoomTopicsQuery,
  RoomTopicsQueryVariables,
  SingleTopicQuery,
  SingleTopicQueryVariables,
  TopicDetailedInfoFragment as TopicDetailedInfoFragmentType,
  TopicMessagesQuery,
  TopicMessagesQueryVariables,
  TopicsQuery,
  TopicsQueryVariables,
  UpdateLastSeenMessageMutationVariables,
} from "~gql";
import { assert } from "~shared/assert";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

import { MessageFeedInfoFragment } from "./messages";
import { RoomBasicInfoFragment, RoomDetailedInfoFragment } from "./rooms";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";

function optimisticallySortTopics(topics: TopicDetailedInfoFragmentType[]) {
  topics.sort((t1, t2) => (t1.index > t2.index ? 1 : -1));
}

export const TopicDetailedInfoFragment = createFragment<TopicDetailedInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    ${RoomBasicInfoFragment()}

    fragment TopicDetailedInfo on topic {
      id
      name
      index
      slug
      closed_at
      closing_summary
      owner {
        ...UserBasicInfo
      }
      closed_by_user {
        ...UserBasicInfo
      }
      room {
        ...RoomBasicInfo
      }
      members {
        user {
          ...UserBasicInfo
        }
      }
      lastMessage: messages_aggregate {
        aggregate {
          max {
            created_at
          }
        }
      }
    }
  `
);

export const [useCreateTopicMutation, { mutate: createTopic }] = createMutation<
  CreateTopicMutation,
  CreateTopicMutationVariables
>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    mutation CreateTopic($input: topic_insert_input!) {
      topic: insert_topic_one(object: $input) {
        ...TopicDetailedInfo
      }
    }
  `,
  {
    defaultVariables() {
      return {
        input: {
          id: getUUID(),
        },
      };
    },
    inputMapper({ input }) {
      if (input.name && !input.slug) {
        input.slug = slugify(input.name);
      }
    },
    optimisticResponse({ input }) {
      assert(input.owner_id, "No owner id");

      return {
        __typename: "mutation_root",
        topic: {
          __typename: "topic",
          id: input.id!,
          index: input.index!,
          owner: UserBasicInfoFragment.assertRead(input.owner_id),
          lastMessage: {
            __typename: "message_aggregate",
            aggregate: {
              __typename: "message_aggregate_fields",
              max: null,
            },
          },
          members: [],
          room: RoomBasicInfoFragment.assertRead(input.room_id!),
          name: input.name!,
          slug: input.slug!,
          closed_at: null,
          closed_by_user: null,
          closing_summary: null,
        },
      };
    },
    onOptimisticOrActualResponse(topic, variables) {
      RoomDetailedInfoFragment.update(variables.input.room_id!, (data) => {
        data.topics.push(topic);
        optimisticallySortTopics(data.topics);
      });
    },
  }
);

export const [useRoomTopicsQuery] = createQuery<RoomTopicsQuery, RoomTopicsQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query RoomTopics($roomId: uuid!) {
      topics: topic(where: { room_id: { _eq: $roomId } }, order_by: [{ index: asc }]) {
        ...TopicDetailedInfo
      }
    }
  `
);

export const [useTopicMessagesQuery, topicMessagesQueryManager] = createQuery<
  TopicMessagesQuery,
  TopicMessagesQueryVariables
>(
  () => gql`
    ${MessageFeedInfoFragment()}

    query TopicMessages(
      $topicId: uuid!
      $limit: Int
      $order: order_by = asc
      $typeExpression: message_type_enum_comparison_exp = { _is_null: false }
    ) {
      messages: message(
        where: { topic_id: { _eq: $topicId }, is_draft: { _eq: false }, type: $typeExpression }
        order_by: [{ created_at: $order }]
        limit: $limit
      ) {
        ...MessageFeedInfo
      }
    }
  `
);

export const [useLastSeenMessageMutation, { mutate: updateLastSeenMessage }] = createMutation<
  UpdateLastSeenMessageMutationVariables,
  UpdateLastSeenMessageMutationVariables
>(
  () => gql`
    mutation UpdateLastSeenMessage($topicId: uuid!, $messageId: uuid!) {
      insert_last_seen_message_one(
        object: { topic_id: $topicId, message_id: $messageId }
        on_conflict: { constraint: last_seen_message_pkey, update_columns: [message_id] }
      ) {
        message_id
        seen_at
      }
    }
  `
);

export const [useSingleTopicQuery, singleTopicQueryManager] = createQuery<SingleTopicQuery, SingleTopicQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query SingleTopic($id: uuid!) {
      topic: topic_by_pk(id: $id) {
        ...TopicDetailedInfo
      }
    }
  `
);

export const [useTopicsQuery] = createQuery<TopicsQuery, TopicsQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query Topics($limit: Int = 10, $orderBy: [topic_order_by!], $where: topic_bool_exp) {
      topics: topic(where: $where, limit: $limit, order_by: $orderBy) {
        ...TopicDetailedInfo
      }
    }
  `
);
