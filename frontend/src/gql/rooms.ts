import { gql } from "@apollo/client";
import {
  CreateRoomMutation,
  CreateRoomMutationVariables,
  GetRoomsQuery,
  GetRoomsQueryVariables,
  GetSingleRoomQuery,
  GetSingleRoomQueryVariables,
  RoomParticipantsQuery,
  RoomParticipantsQueryVariables,
} from "./generated";
import { getSingleSpaceManager } from "./spaces";

import { createMutation, createQuery } from "./utils";

export const RoomBasicInfoFragment = () => gql`
  fragment RoomBasicInfo on room {
    id
    name
    space_id
    participants {
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }
  }
`;

export const RoomDetailedInfoFragment = () => gql`
  fragment RoomDetailedInfo on room {
    id
    name
    space_id

    participants {
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }

    topics {
      id
      name
      index
    }
  }
`;

const RoomParticipantBasicInfoFragment = () => gql`
  fragment RoomParticipantBasicInfo on room_participants {
    user {
      name
      avatarUrl: avatar_url
    }
  }
`;

export const [useGetRoomsQuery] = createQuery<GetRoomsQuery, GetRoomsQueryVariables>(
  () => gql`
    ${RoomBasicInfoFragment()}

    query GetRooms {
      room {
        ...RoomBasicInfo
      }
    }
  `
);

export const [useGetSingleRoomQuery, getSingleRoomManager] = createQuery<
  GetSingleRoomQuery,
  GetSingleRoomQueryVariables
>(
  () => gql`
    ${RoomDetailedInfoFragment()}

    query GetSingleRoom($id: uuid!) {
      room: room_by_pk(id: $id) {
        ...RoomDetailedInfo
      }
    }
  `
);

export const [useCreateRoomMutation] = createMutation<CreateRoomMutation, CreateRoomMutationVariables>(
  () => gql`
    ${RoomDetailedInfoFragment()}

    mutation CreateRoom($name: String!, $spaceId: uuid!) {
      room: insert_room_one(object: { name: $name, space_id: $spaceId }) {
        ...RoomDetailedInfo
      }
    }
  `,
  {
    onSuccess(result, variables) {
      getSingleSpaceManager.update({ id: variables.spaceId }, (spaceQuery) => {
        if (!result.room) return;
        spaceQuery.space?.rooms.push(result.room);
      });
    },
  }
);

export const [useRoomParticipants] = createQuery<RoomParticipantsQuery, RoomParticipantsQueryVariables>(
  () => gql`
    ${RoomParticipantBasicInfoFragment()}

    query RoomParticipants($roomId: uuid!) {
      participants: room_participants(where: { room_id: { _eq: $roomId } }) {
        ...RoomParticipantBasicInfo
      }
    }
  `
);
