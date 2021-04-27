import { gql } from "@apollo/client";
import {
  CreateRoomMutation,
  CreateRoomMutationVariables,
  GetRoomsQuery,
  GetRoomsQueryVariables,
  GetSingleRoomQuery,
  GetSingleRoomQueryVariables,
  RoomParticipantsSubscription,
  RoomParticipantsSubscriptionVariables,
} from "./generated";

import { createMutation, createQuery, createSubscription } from "./utils";

const RoomBasicInfoFragment = gql`
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

const RoomDetailedInfoFragment = gql`
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

const RoomParticipantBasicInfoFragment = gql`
  fragment RoomParticipantBasicInfo on room_participants {
    user {
      name
      avatarUrl: avatar_url
    }
  }
`;

export const [useGetRoomsQuery] = createQuery<GetRoomsQuery, GetRoomsQueryVariables>(gql`
  ${RoomBasicInfoFragment}

  query GetRooms {
    room {
      ...RoomBasicInfo
    }
  }
`);

export const [useGetSingleRoomQuery] = createQuery<GetSingleRoomQuery, GetSingleRoomQueryVariables>(gql`
  ${RoomDetailedInfoFragment}

  query GetSingleRoom($id: uuid!) {
    room: room_by_pk(id: $id) {
      ...RoomDetailedInfo
    }
  }
`);

export const [useCreateRoomMutation] = createMutation<CreateRoomMutation, CreateRoomMutationVariables>(gql`
  ${RoomBasicInfoFragment}

  mutation CreateRoom($name: String!) {
    room: insert_room_one(object: { name: $name }) {
      ...RoomBasicInfo
    }
  }
`);

export const [useRoomParticipantsSubscription] = createSubscription<
  RoomParticipantsSubscription,
  RoomParticipantsSubscriptionVariables
>(gql`
  ${RoomParticipantBasicInfoFragment}

  subscription RoomParticipants($roomId: uuid!) {
    participants: room_participants(where: { room_id: { _eq: $roomId } }) {
      ...RoomParticipantBasicInfo
    }
  }
`);
