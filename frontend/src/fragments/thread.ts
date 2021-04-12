import { gql } from "@apollo/client";

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
