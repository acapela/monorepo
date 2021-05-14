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
  GetUploadUrlQuery,
  GetUploadUrlQueryVariables,
  RoomTopicsQuery,
  RoomTopicsQueryVariables,
  TopicMessagesQuery,
  TopicMessagesQueryVariables,
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables,
} from "./generated";
import { createMutation, createQuery } from "./utils";

const TopicDetailedInfoFragment = () => gql`
  fragment TopicDetailedInfo on topic {
    id
    name
    index
  }
`;

const TopicMessageBasicInfoFragment = () => gql`
  fragment TopicMessageBasicInfo on message {
    id
    createdAt: created_at
    content
    user {
      id
      name
      avatarUrl: avatar_url
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
      id
      name
      avatarUrl: avatar_url
    }
    message_attachments {
      attachment {
        ...AttachmentDetailedInfo
      }
    }
  }
`;

export const [useCreateTopicMutation] = createMutation<CreateTopicMutation, CreateTopicMutationVariables>(
  () => gql`
    mutation CreateTopic($name: String!, $roomId: uuid!, $index: String!) {
      topic: insert_topic_one(object: { name: $name, room_id: $roomId, index: $index }) {
        id
      }
    }
  `
);

export const [useRoomTopicsSubscription] = createQuery<RoomTopicsQuery, RoomTopicsQueryVariables>(
  () => gql`
    ${TopicDetailedInfoFragment()}

    query RoomTopics($roomId: uuid!) {
      topics: topic(where: { room_id: { _eq: $roomId } }, order_by: [{ index: asc }]) {
        ...TopicDetailedInfo
      }
    }
  `
);

export const [useTopicMessages, topicMessagesSubscriptionManager] = createQuery<
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
      $attachments: [message_attachments_insert_input!]!
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
      topicMessagesSubscriptionManager.update({ topicId: variables.topicId }, (current) => {
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

    mutation UpdateTextMessage($id: uuid!, $content: jsonb!, $isDraft: Boolean) {
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
  query GetAttachment($id: uuid!) {
    ${AttachmentDetailedInfoFragment}

    attachment: attachment_by_pk(id: $id) {
      ...AttachmentDetailedInfo
    }
  }
`
);
