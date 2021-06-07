import { gql } from "@apollo/client";
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  CreateTopicMutation,
  CreateTopicMutationVariables,
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables,
  GetAttachmentQuery,
  GetAttachmentQueryVariables,
  GetDownloadUrlQuery,
  GetDownloadUrlQueryVariables,
  GetUnreadMessagesQuery,
  GetUnreadMessagesQueryVariables,
  GetUploadUrlQuery,
  GetUploadUrlQueryVariables,
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
  RecentTopicsQuery,
  RecentTopicsQueryVariables,
  ToggleCloseTopicMutation,
  ToggleCloseTopicMutationVariables,
  EditTopicMutation,
  EditTopicMutationVariables,
} from "./generated";
import { RoomBasicInfoFragment } from "./rooms";
import { UserBasicInfoFragment } from "./user";
import { createMutation, createQuery } from "./utils";

export const TopicDetailedInfoFragment = () => gql`
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
`;

const TopicMessageBasicInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  fragment TopicMessageBasicInfo on message {
    id
    createdAt: created_at
    content
    user {
      ...UserBasicInfo
    }
  }
`;

const AttachmentDetailedInfoFragment = () => gql`
  fragment AttachmentDetailedInfo on attachment {
    id
    originalName: original_name
    mimeType: mime_type
  }
`;

const TopicMessageDetailedInfoFragment = () => gql`
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
`;

const UnreadMessageFragment = () => gql`
  fragment UnreadMessageFragment on unread_messages {
    roomId: room_id
    topicId: topic_id
    unreadMessages: unread_messages
  }
`;

export const [useCreateTopicMutation] = createMutation<CreateTopicMutation, CreateTopicMutationVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    mutation CreateTopic($name: String!, $roomId: uuid!, $index: String!, $slug: String!) {
      topic: insert_topic_one(object: { name: $name, room_id: $roomId, index: $index, slug: $slug }) {
        ...TopicDetailedInfo
      }
    }
  `
);

export const [useRoomTopics] = createQuery<RoomTopicsQuery, RoomTopicsQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query RoomTopics($roomId: uuid!) {
      topics: topic(where: { room_id: { _eq: $roomId } }, order_by: [{ index: asc }]) {
        ...TopicDetailedInfo
      }
    }
  `
);

export const [useTopicMessages, topicMessagesManager] = createQuery<TopicMessagesQuery, TopicMessagesQueryVariables>(
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
    onSuccess: (data, variables) => {
      topicMessagesManager.update({ topicId: variables.topicId }, (current) => {
        if (!data.message) {
          return;
        }
        current.messages.push(data.message);
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

export const [useGetUploadUrlQuery, getUploadUrlQueryManager] = createQuery<
  GetUploadUrlQuery,
  GetUploadUrlQueryVariables
>(
  () => gql`
    query GetUploadUrl($fileName: String!, $mimeType: String!) {
      uploadUrlInfo: get_upload_url(fileName: $fileName, mimeType: $mimeType) {
        uploadUrl
        uuid
      }
    }
  `
);

export const [useGetDownloadUrlQuery] = createQuery<GetDownloadUrlQuery, GetDownloadUrlQueryVariables>(
  () => gql`
    query GetDownloadUrl($id: uuid!) {
      get_download_url(uuid: $id) {
        downloadUrl
      }
    }
  `
);

export const [useGetAttachmentQuery] = createQuery<GetAttachmentQuery, GetAttachmentQueryVariables>(
  () => gql`
    ${AttachmentDetailedInfoFragment()}
    query GetAttachment($id: uuid!) {
      attachment: attachment_by_pk(id: $id) {
        ...AttachmentDetailedInfo
      }
    }
  `
);

export const [useAddTopicMember] = createMutation<AddTopicMemberMutation, AddTopicMemberMutationVariables>(
  () => gql`
    mutation AddTopicMember($topicId: uuid!, $userId: uuid!) {
      insert_topic_member_one(object: { topic_id: $topicId, user_id: $userId }) {
        topic_id
        user_id
      }
    }
  `
);

export const [useRemoveTopicMember] = createMutation<RemoveTopicMemberMutation, RemoveTopicMemberMutationVariables>(
  () => gql`
    mutation RemoveTopicMember($topicId: uuid!, $userId: uuid!) {
      delete_topic_member(where: { topic_id: { _eq: $topicId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `
);

export const [useUnreadMessages] = createQuery<GetUnreadMessagesQuery, GetUnreadMessagesQueryVariables>(
  () => gql`
    ${UnreadMessageFragment()}
    query GetUnreadMessages($roomId: uuid) {
      messages: unread_messages(where: { room_id: { _eq: $roomId } }) {
        ...UnreadMessageFragment
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

export const [useRecentTopics] = createQuery<RecentTopicsQuery, RecentTopicsQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query RecentTopics($teamId: uuid!, $limit: Int = 10, $userId: uuid!) {
      recentTopics: topic(
        where: { members: { user_id: { _eq: $userId } }, room: { space: { team: { id: { _eq: $teamId } } } } }
        limit: $limit
        # TODO: I'm not sure about performance of this in large scale. Should be good tho if used with index.
        order_by: { messages_aggregate: { max: { created_at: desc } } }
      ) {
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
  `
);
