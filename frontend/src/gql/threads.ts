import { gql } from "@apollo/client";

gql`
  fragment ThreadDetailedInfo on thread {
    id
    name
    index
  }
`;

gql`
  fragment ThreadMessageBasicInfo on message {
    id
    text
    createdAt: created_at
    user {
      id
      name
      avatarUrl: avatar_url
    }
  }
`;

gql`
  fragment AttachmentDetailedInfo on attachment {
    id
    originalName: original_name
    mimeType: mime_type
  }
`;

gql`
  fragment ThreadMessageDetailedInfo on message {
    id
    text
    createdAt: created_at
    type
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

gql`
  mutation CreateThread($name: String!, $roomId: uuid!, $index: String!) {
    thread: insert_thread_one(object: { name: $name, room_id: $roomId, index: $index }) {
      id
    }
  }
`;

gql`
  subscription RoomThreads($roomId: uuid!) {
    threads: thread(where: { room_id: { _eq: $roomId } }, order_by: [{ index: asc }]) {
      ...ThreadDetailedInfo
    }
  }
`;

gql`
  subscription ThreadMessages($threadId: uuid!) {
    messages: message(
      where: { thread_id: { _eq: $threadId }, is_draft: { _eq: false } }
      order_by: [{ created_at: asc }]
    ) {
      ...ThreadMessageDetailedInfo
    }
  }
`;

gql`
  mutation CreateMessage(
    $threadId: uuid!
    $text: String!
    $type: message_type_enum!
    $attachments: [message_attachments_insert_input!]!
  ) {
    message: insert_message_one(
      object: {
        text: $text
        thread_id: $threadId
        type: $type
        message_attachments: { data: $attachments }
        is_draft: false
      }
    ) {
      id
    }
  }
`;

gql`
  mutation UpdateTextMessage($id: uuid!, $text: String!, $isDraft: Boolean) {
    update_message(where: { id: { _eq: $id } }, _set: { text: $text, is_draft: $isDraft }) {
      message: returning {
        ...ThreadMessageBasicInfo
      }
    }
  }
`;

gql`
  mutation DeleteTextMessage($id: uuid!) {
    delete_message(where: { id: { _eq: $id } }) {
      message: returning {
        id
      }
    }
  }
`;

gql`
  query GetUploadUrl($fileName: String!, $mimeType: String!) {
    get_upload_url(fileName: $fileName, mimeType: $mimeType) {
      uploadUrl
      uuid
    }
  }
`;

gql`
  query GetDownloadUrl($id: uuid!) {
    get_download_url(uuid: $id) {
      downloadUrl
    }
  }
`;

gql`
  query GetAttachment($id: uuid!) {
    attachment: attachment_by_pk(id: $id) {
      ...AttachmentDetailedInfo
    }
  }
`;
