import { gql } from "@apollo/client";

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
