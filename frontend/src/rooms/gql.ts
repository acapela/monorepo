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

gql`
  query GetRooms {
    room {
      ...RoomBasicInfo
    }
  }
`;

gql`
  query GetSingleRoom($id: uuid!) {
    room: room_by_pk(id: $id) {
      ...RoomDetailedInfo
    }
  }
`;

gql`
  mutation CreateRoom($name: String!) {
    room: insert_room_one(object: { name: $name }) {
      id
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
