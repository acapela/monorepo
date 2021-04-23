import { gql } from "@apollo/client";
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  CreateThreadMutation,
  CreateThreadMutationVariables,
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables,
  GetAttachmentQuery,
  GetAttachmentQueryVariables,
  GetDownloadUrlQuery,
  GetDownloadUrlQueryVariables,
  GetUploadUrlQuery,
  GetUploadUrlQueryVariables,
  RoomThreadsSubscription,
  RoomThreadsSubscriptionVariables,
  ThreadMessagesSubscription,
  ThreadMessagesSubscriptionVariables,
  UpdateTextMessageMutation,
  UpdateTextMessageMutationVariables,
} from "./generated";
import { createMutation, createSubscription, createQuery } from "./utils";

const ThreadDetailedInfoFragment = gql`
  fragment ThreadDetailedInfo on thread {
    id
    name
    index
  }
`;

const ThreadMessageBasicInfoFragment = gql`
  fragment ThreadMessageBasicInfo on message {
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

const AttachmentDetailedInfoFragment = gql`
  fragment AttachmentDetailedInfo on attachment {
    id
    originalName: original_name
    mimeType: mime_type
  }
`;

const ThreadMessageDetailedInfoFragment = gql`
  ${AttachmentDetailedInfoFragment}

  fragment ThreadMessageDetailedInfo on message {
    id
    content
    createdAt: created_at
    content
    type
    transcription
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

export const [useCreateThreadMutation] = createMutation<CreateThreadMutation, CreateThreadMutationVariables>(gql`
  mutation CreateThread($name: String!, $roomId: uuid!, $index: String!) {
    thread: insert_thread_one(object: { name: $name, room_id: $roomId, index: $index }) {
      id
    }
  }
`);

export const [useRoomThreadsSubscription] = createSubscription<
  RoomThreadsSubscription,
  RoomThreadsSubscriptionVariables
>(gql`
  ${ThreadDetailedInfoFragment}

  subscription RoomThreads($roomId: uuid!) {
    threads: thread(where: { room_id: { _eq: $roomId } }, order_by: [{ index: asc }]) {
      ...ThreadDetailedInfo
    }
  }
`);

export const [useThreadMessagesSubscription, threadMessagesSubscriptionManager] = createSubscription<
  ThreadMessagesSubscription,
  ThreadMessagesSubscriptionVariables
>(gql`
  ${ThreadMessageDetailedInfoFragment}

  subscription ThreadMessages($threadId: uuid!) {
    messages: message(
      where: { thread_id: { _eq: $threadId }, is_draft: { _eq: false } }
      order_by: [{ created_at: asc }]
    ) {
      ...ThreadMessageDetailedInfo
    }
  }
`);

export const [useCreateMessageMutation] = createMutation<CreateMessageMutation, CreateMessageMutationVariables>(
  gql`
  mutation CreateMessage(
    $threadId: uuid!
    $content: jsonb!
    $type: message_type_enum!
    $attachments: [message_attachments_insert_input!]!
  ) {
    ${ThreadMessageDetailedInfoFragment}

    message: insert_message_one(
      object: {
        content: $content
        thread_id: $threadId
        type: $type
        message_attachments: { data: $attachments }
        is_draft: false
      }
    ) {
      ...ThreadMessageDetailedInfo
    }
  }
`,
  {
    onSuccess: (data, variables) => {
      threadMessagesSubscriptionManager.update({ threadId: variables.threadId }, (current) => {
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
>(gql`
  ${ThreadMessageBasicInfoFragment}

  mutation UpdateTextMessage($id: uuid!, $content: jsonb!, $isDraft: Boolean) {
    update_message(where: { id: { _eq: $id } }, _set: { content: $content, is_draft: $isDraft }) {
      message: returning {
        ...ThreadMessageBasicInfo
      }
    }
  }
`);

export const [useDeleteTextMessageMutation] = createMutation<
  DeleteTextMessageMutation,
  DeleteTextMessageMutationVariables
>(gql`
  mutation DeleteTextMessage($id: uuid!) {
    delete_message(where: { id: { _eq: $id } }) {
      message: returning {
        id
      }
    }
  }
`);

export const [useGetUploadUrlQuery] = createQuery<GetUploadUrlQuery, GetUploadUrlQueryVariables>(gql`
  query GetUploadUrl($fileName: String!, $mimeType: String!) {
    get_upload_url(fileName: $fileName, mimeType: $mimeType) {
      uploadUrl
      uuid
    }
  }
`);

export const [useGetDownloadUrlQuery] = createQuery<GetDownloadUrlQuery, GetDownloadUrlQueryVariables>(gql`
  query GetDownloadUrl($id: uuid!) {
    get_download_url(uuid: $id) {
      downloadUrl
    }
  }
`);

export const [useGetAttachmentQuery] = createQuery<GetAttachmentQuery, GetAttachmentQueryVariables>(gql`
  query GetAttachment($id: uuid!) {
    ${AttachmentDetailedInfoFragment}

    attachment: attachment_by_pk(id: $id) {
      ...AttachmentDetailedInfo
    }
  }
`);
