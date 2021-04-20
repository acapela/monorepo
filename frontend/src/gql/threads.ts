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
  fragment ThreadMessageDetailedInfo on message {
    id
    text
    createdAt: created_at
    user {
      id
      name
      avatarUrl: avatar_url
    }
    message_attachments {
      attachment {
        id
        original_name
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
      where: { _or: [{ is_draft: { _eq: false } }, { is_draft: { _is_null: true } }], thread_id: { _eq: $threadId } }
      order_by: [{ created_at: asc }]
    ) {
      ...ThreadMessageDetailedInfo
    }
  }
`;

gql`
  mutation CreateMessageDraft($threadId: uuid!, $text: String!) {
    message: insert_message_one(object: { text: $text, thread_id: $threadId, type: TEXT, is_draft: true }) {
      id
    }
  }
`;

gql`
  query GetMessageDraft($threadId: uuid!) {
    message: message(where: { thread_id: { _eq: $threadId }, is_draft: { _eq: true } }, limit: 1) {
      ...ThreadMessageBasicInfo
    }
  }
`;

gql`
  mutation UpdateTextMessage(
    $id: uuid!
    $text: String!
    $isDraft: Boolean #    $attachments: [message_attachments_insert_input!]!
  ) {
    update_message(where: { id: { _eq: $id } }, _set: { text: $text, is_draft: $isDraft }) {
      message: returning {
        ...ThreadMessageBasicInfo
      }
    }
    #    insert_message_attachments(objects: $attachments) {
    #      attachments: returning {
    #        attachment {
    #          id
    #          original_name
    #        }
    #      }
    #    }
  }
`;

gql`
  mutation LinkAttachment($messageId: uuid!, $attachmentId: uuid!) {
    insert_message_attachments_one(object: { message_id: $messageId, attachment_id: $attachmentId }) {
      attachment {
        id
        original_name
      }
      message {
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
