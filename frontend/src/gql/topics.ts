import { gql } from "@apollo/client";
import { addToast } from "~ui/toasts/data";
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  CreateTopicMutation,
  CreateTopicMutationVariables,
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables,
  AttachmentQuery,
  AttachmentQueryVariables,
  DownloadUrlQuery,
  DownloadUrlQueryVariables,
  UploadUrlQuery,
  UploadUrlQueryVariables,
  RoomTopicsQuery,
  RoomTopicsQueryVariables,
  TopicMessagesQuery,
  TopicMessagesQueryVariables,
  UpdateLastSeenMessageMutationVariables,
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables,
  AddTopicMemberMutation,
  AddTopicMemberMutationVariables,
  RemoveTopicMemberMutation,
  RemoveTopicMemberMutationVariables,
  SingleTopicQuery,
  SingleTopicQueryVariables,
  TopicsQuery,
  TopicsQueryVariables,
  ToggleCloseTopicMutation,
  ToggleCloseTopicMutationVariables,
  EditTopicMutation,
  EditTopicMutationVariables,
  DeleteTopicMutation,
  DeleteTopicMutationVariables,
  ReorderTopicMutation,
  ReorderTopicMutationVariables,
  TopicDetailedInfoFragment as TopicDetailedInfoFragmentType,
  TopicMessageBasicInfoFragment as TopicMessageBasicInfoFragmentType,
  AttachmentDetailedInfoFragment as AttachmentDetailedInfoFragmentType,
  TopicMessageDetailedInfoFragment as TopicMessageDetailedInfoFragmentType,
} from "~gql";
import { RoomBasicInfoFragment, RoomDetailedInfoFragment } from "./rooms";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";
import { assert } from "~shared/assert";
import { getUUID } from "~shared/uuid";
import { assertReadUserDataFromCookie } from "~frontend/authentication/cookie";

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

const TopicMessageBasicInfoFragment = createFragment<TopicMessageBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    fragment TopicMessageBasicInfo on message {
      id
      createdAt: created_at
      content
      user {
        ...UserBasicInfo
      }
    }
  `
);

const AttachmentDetailedInfoFragment = createFragment<AttachmentDetailedInfoFragmentType>(
  () => gql`
    fragment AttachmentDetailedInfo on attachment {
      id
      originalName: original_name
      mimeType: mime_type
    }
  `
);

const TopicMessageDetailedInfoFragment = createFragment<TopicMessageDetailedInfoFragmentType>(
  () => gql`
    ${AttachmentDetailedInfoFragment()}
    ${UserBasicInfoFragment()}

    fragment TopicMessageDetailedInfo on message {
      id
      content
      createdAt: created_at
      content
      type
      transcription {
        status
        transcript
      }
      user {
        ...UserBasicInfo
      }
      message_attachments {
        attachment {
          ...AttachmentDetailedInfo
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
    mutation CreateTopic($name: String!, $roomId: uuid!, $index: String!, $slug: String!) {
      topic: insert_topic_one(object: { name: $name, room_id: $roomId, index: $index, slug: $slug }) {
        ...TopicDetailedInfo
      }
    }
  `,
  {
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        topic: {
          __typename: "topic",
          id: getUUID(),
          index: variables.index,
          lastMessage: {
            __typename: "message_aggregate",
            aggregate: { __typename: "message_aggregate_fields", max: null },
          },
          members: [],
          room: RoomBasicInfoFragment.assertRead(variables.roomId),
          name: variables.name,
          slug: variables.slug,
        },
      };
    },
    onResult(topic, variables) {
      console.log("success");
      if (!topic?.id) return;
      RoomDetailedInfoFragment.update(variables.roomId, (data) => {
        console.log("trying inside", data);
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
    ${TopicMessageDetailedInfoFragment()}

    query TopicMessages($topicId: uuid!) {
      messages: message(
        where: { topic_id: { _eq: $topicId }, is_draft: { _eq: false } }
        order_by: [{ created_at: asc }]
      ) {
        ...TopicMessageDetailedInfo
      }
    }
  `
);

export const [useCreateMessageMutation] = createMutation<CreateMessageMutation, CreateMessageMutationVariables>(
  () => gql`
    ${TopicMessageDetailedInfoFragment()}

    mutation CreateMessage(
      $topicId: uuid!
      $content: jsonb!
      $type: message_type_enum!
      $attachments: [message_attachment_insert_input!]!
    ) {
      message: insert_message_one(
        object: {
          content: $content
          topic_id: $topicId
          type: $type
          message_attachments: { data: $attachments }
          is_draft: false
        }
      ) {
        ...TopicMessageDetailedInfo
      }
    }
  `,
  {
    optimisticResponse(vars) {
      const userData = assertReadUserDataFromCookie();

      return {
        __typename: "mutation_root",
        message: {
          __typename: "message",
          createdAt: new Date(),
          message_attachments: [],
          type: vars.type,
          user: {
            id: userData.id,
            __typename: "user",
            avatar_url: userData.picture,
            email: userData.email,
            name: userData.name,
          },
          id: getUUID(),
          content: vars.content,
        },
      };
    },
    onResult: (message, variables) => {
      topicMessagesQueryManager.update({ topicId: variables.topicId }, (current) => {
        if (!message) {
          return;
        }
        current.messages.push(message);
      });
    },
  }
);

export const [useUpdateTextMessageMutation] = createMutation<
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables
>(
  () => gql`
    ${TopicMessageBasicInfoFragment()}

    mutation UpdateTextMessage($id: uuid!, $content: jsonb!, $isDraft: Boolean!) {
      update_message(where: { id: { _eq: $id } }, _set: { content: $content, is_draft: $isDraft }) {
        message: returning {
          ...TopicMessageBasicInfo
        }
      }
    }
  `
);

export const [useDeleteTextMessageMutation] = createMutation<
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables
>(
  () => gql`
    mutation DeleteTextMessage($id: uuid!) {
      delete_message(where: { id: { _eq: $id } }) {
        message: returning {
          id
        }
      }
    }
  `
);

export const [useUploadUrlQuery, uploadUrlQueryManager] = createQuery<UploadUrlQuery, UploadUrlQueryVariables>(
  () => gql`
    query UploadUrl($fileName: String!, $mimeType: String!) {
      uploadUrlInfo: get_upload_url(fileName: $fileName, mimeType: $mimeType) {
        uploadUrl
        uuid
      }
    }
  `
);

export const [useDownloadUrlQuery] = createQuery<DownloadUrlQuery, DownloadUrlQueryVariables>(
  () => gql`
    query DownloadUrl($id: uuid!) {
      get_download_url(uuid: $id) {
        downloadUrl
      }
    }
  `
);

export const [useAttachmentQuery] = createQuery<AttachmentQuery, AttachmentQueryVariables>(
  () => gql`
    ${AttachmentDetailedInfoFragment()}
    query Attachment($id: uuid!) {
      attachment: attachment_by_pk(id: $id) {
        ...AttachmentDetailedInfo
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
  `
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
  `
);

export const [useLastSeenMessageMutation] = createMutation<
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

export const [useToggleCloseTopicMutation] = createMutation<
  ToggleCloseTopicMutation,
  ToggleCloseTopicMutationVariables
>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    mutation ToggleCloseTopic($topicId: uuid!, $closedAt: timestamp, $closedByUserId: uuid, $summary: String) {
      topic: update_topic_by_pk(
        pk_columns: { id: $topicId }
        _set: { closed_at: $closedAt, closed_by_user_id: $closedByUserId, closing_summary: $summary }
      ) {
        ...TopicDetailedInfo
      }
    }
  `
);

export const [useEditTopicMutation] = createMutation<EditTopicMutation, EditTopicMutationVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    mutation EditTopic($name: String!, $topicId: uuid!) {
      topic: update_topic_by_pk(pk_columns: { id: $topicId }, _set: { name: $name }) {
        ...TopicDetailedInfo
      }
    }
  `,
  {
    optimisticResponse(vars) {
      const updatedTopic = TopicDetailedInfoFragment.produce(vars.topicId, (current) => {
        current.name = vars.name;
      });

      assert(updatedTopic, "Failed to create optimistic update for EditTopic");

      return {
        __typename: "mutation_root",
        topic: updatedTopic,
      };
    },
  }
);

export const [useReorderTopicMutation] = createMutation<ReorderTopicMutation, ReorderTopicMutationVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    mutation ReorderTopic($topicId: uuid!, $index: String!) {
      topic: update_topic_by_pk(pk_columns: { id: $topicId }, _set: { index: $index }) {
        ...TopicDetailedInfo
      }
    }
  `
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

      return { topic };
    },
    onResult(removedTopic) {
      RoomDetailedInfoFragment.update(removedTopic.room.id, (room) => {
        room.topics = room.topics.filter((topic) => topic.id !== removedTopic.id);
      });
      addToast({ type: "info", content: `Topic was removed` });
    },
  }
);
