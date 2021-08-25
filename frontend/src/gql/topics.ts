/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from "@apollo/client";

import {
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

import { MessageFeedInfoFragment } from "./messages";
import { RoomBasicInfoFragment } from "./rooms";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";

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

    query Topics($limit: Int, $orderBy: [topic_order_by!], $where: topic_bool_exp) {
      topics: topic(where: $where, limit: $limit, order_by: $orderBy) {
        ...TopicDetailedInfo
      }
    }
  `
);
