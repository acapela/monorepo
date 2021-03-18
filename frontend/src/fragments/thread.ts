import { gql } from "@apollo/client";

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
