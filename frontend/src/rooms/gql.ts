import { gql } from "@apollo/client";

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
  mutation CreateThread($name: String!, $roomId: uuid!, $index: String!) {
    thread: insert_thread_one(object: { name: $name, room_id: $roomId, index: $index }) {
      id
    }
  }
`;

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
  subscription RoomThreads($roomId: uuid!) {
    threads: thread(where: { room_id: { _eq: $roomId } }, order_by: [{ index: asc }]) {
      ...ThreadDetailedInfo
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
  subscription RoomParticipants($roomId: uuid!) {
    participants: room_participants(where: { room_id: { _eq: $roomId } }) {
      ...ParticipantBasicInfo
    }
  }
`;
