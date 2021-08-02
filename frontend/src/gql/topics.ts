/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from "@apollo/client";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";
import {
  AddTopicMemberMutation,
  AddTopicMemberMutationVariables,
  CreateTopicMutation,
  CreateTopicMutationVariables,
  DeleteTopicMutation,
  DeleteTopicMutationVariables,
  RemoveTopicMemberMutation,
  RemoveTopicMemberMutationVariables,
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
  UpdateTopicMutation,
  UpdateTopicMutationVariables,
} from "~gql";
import { addToast } from "~ui/toasts/data";
import { MessageFeedInfoFragment } from "./messages";
import { RoomBasicInfoFragment, RoomDetailedInfoFragment } from "./rooms";
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
      return {
        __typename: "mutation_root",
        topic: {
          __typename: "topic",
          id: input.id!,
          index: input.index!,
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

export const [useAddTopicMemberMutation] = createMutation<AddTopicMemberMutation, AddTopicMemberMutationVariables>(
  () => gql`
    mutation AddTopicMember($topicId: uuid!, $userId: uuid!) {
      insert_topic_member_one(object: { topic_id: $topicId, user_id: $userId }) {
        topic_id
        user_id
      }
    }
  `,
  {
    optimisticResponse(vars) {
      return {
        __typename: "mutation_root",
        insert_topic_member_one: {
          __typename: "topic_member",
          topic_id: vars.topicId,
          user_id: vars.userId,
        },
      };
    },
    onOptimisticOrActualResponse(data, vars) {
      TopicDetailedInfoFragment.update(vars.topicId, (topic) => {
        topic.members.push({ __typename: "topic_member", user: UserBasicInfoFragment.assertRead(vars.userId) });
      });
    },
  }
);

export const [useRemoveTopicMemberMutation] = createMutation<
  RemoveTopicMemberMutation,
  RemoveTopicMemberMutationVariables
>(
  () => gql`
    mutation RemoveTopicMember($topicId: uuid!, $userId: uuid!) {
      delete_topic_member(where: { topic_id: { _eq: $topicId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `,
  {
    optimisticResponse() {
      return {
        __typename: "mutation_root",
        delete_topic_member: {
          __typename: "topic_member_mutation_response",
          affected_rows: 1,
        },
      };
    },
    onOptimisticOrActualResponse(data, vars) {
      TopicDetailedInfoFragment.update(vars.topicId, (topic) => {
        topic.members = topic.members.filter((member) => member.user.id !== vars.userId);
      });
    },
  }
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

export const [useUpdateTopicMutation, { mutate: updateTopic }] = createMutation<
  UpdateTopicMutation,
  UpdateTopicMutationVariables
>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    mutation UpdateTopic($topicId: uuid!, $input: topic_set_input!) {
      topic: update_topic_by_pk(pk_columns: { id: $topicId }, _set: $input) {
        ...TopicDetailedInfo
      }
    }
  `,
  {
    inputMapper({ input }) {
      if (input.name && !input.slug) {
        input.slug = slugify(input.name);
      }
    },
    optimisticResponse({ input, topicId }) {
      const existingData = TopicDetailedInfoFragment.assertRead(topicId);

      function closedByUser() {
        if (input.closed_by_user_id) {
          return UserBasicInfoFragment.assertRead(input.closed_by_user_id);
        }

        return existingData.closed_by_user;
      }

      return {
        __typename: "mutation_root",
        topic: {
          __typename: "topic",
          ...existingData,
          name: input.name ?? existingData.name,
          slug: input.slug ?? existingData.slug,
          closed_at: input.closed_at !== undefined ? input.closed_at : existingData.closed_at,
          closed_by_user: closedByUser(),
          index: input.index ?? existingData.index,
        },
      };
    },
  }
);

export const [useDeleteTopicMutation] = createMutation<DeleteTopicMutation, DeleteTopicMutationVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    mutation DeleteTopic($topicId: uuid!) {
      topic: delete_topic_by_pk(id: $topicId) {
        ...TopicDetailedInfo
      }
    }
  `,
  {
    optimisticResponse(vars) {
      const topic = TopicDetailedInfoFragment.assertRead(vars.topicId);

      return { __typename: "mutation_root", topic };
    },
    onOptimisticOrActualResponse(removedTopic) {
      TopicDetailedInfoFragment.removeFromCache(removedTopic.id);
    },
    onActualResponse() {
      addToast({ type: "info", content: `Topic was removed` });
    },
  }
);
