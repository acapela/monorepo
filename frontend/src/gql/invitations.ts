import { gql } from "@apollo/client";

gql`
  mutation CreateInvite($email: String!, $roomId: uuid) {
    invite: insert_room_invites_one(object: { email: $email, room_id: $roomId }) {
      id
      email
      usedAt: used_at
    }
  }
`;

gql`
  query GetRoomInvites($roomId: uuid!) {
    invites: room_invites(where: { room_id: { _eq: $roomId } }) {
      id
      email
      usedAt: used_at
    }
  }
`;

gql`
  mutation AcceptInvite($code: String!) {
    invite: accept_invite(code: $code) {
      roomId: room_id
    }
  }
`;

// Fragments

gql`
  fragment RoomBasicInfo on room {
    id
    name
    participants {
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }
  }
`;

gql`
  fragment RoomDetailedInfo on room {
    id
    name

    participants {
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }

    threads {
      id
      name
      index
    }
  }
`;

gql`
  fragment ParticipantBasicInfo on room_participants {
    user {
      name
      avatarUrl: avatar_url
    }
  }
`;

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
  mutation CreateTextMessage($text: String!, $threadId: uuid!) {
    message: insert_message_one(object: { text: $text, thread_id: $threadId, type: TEXT }) {
      ...ThreadMessageBasicInfo
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
