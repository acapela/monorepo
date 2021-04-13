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
    messages: message(where: { thread_id: { _eq: $threadId } }, order_by: [{ created_at: asc }]) {
      ...ThreadMessageBasicInfo
    }
  }
`;

gql`
  mutation CreateTextMessage($text: String!, $threadId: uuid!) {
    message: insert_message_one(object: { text: $text, thread_id: $threadId, type: TEXT }) {
      ...ThreadMessageBasicInfo
    }
  }
`;

gql`
  mutation UpdateTextMessage($id: uuid!, $text: String!) {
    update_message(where: { id: { _eq: $id } }, _set: { text: $text }) {
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
