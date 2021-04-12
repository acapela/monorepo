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
  fragment RoomParticipantBasicInfo on room_participants {
    user {
      name
      avatarUrl: avatar_url
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
      ...RoomBasicInfo
    }
  }
`;

gql`
  subscription RoomParticipants($roomId: uuid!) {
    participants: room_participants(where: { room_id: { _eq: $roomId } }) {
      ...ParticipantBasicInfo
    }
  }
`;
