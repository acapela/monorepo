import { gql } from "@apollo/client";
import {
  CreateRoomMutation,
  CreateRoomMutationVariables,
  GetRoomsQuery,
  GetRoomsQueryVariables,
  SingleRoomQuery,
  SingleRoomQueryVariables,
  RoomParticipantsQuery,
  RoomParticipantsQueryVariables,
  AddRoomMemberMutation,
  AddRoomMemberMutationVariables,
  RemoveRoomMemberMutation,
  RemoveRoomMemberMutationVariables,
} from "./generated";
import { getSingleSpaceManager } from "./spaces";
import { TopicDetailedInfoFragment } from "./topics";

import { createMutation, createQuery } from "./utils";

export const RoomBasicInfoFragment = () => gql`
  fragment RoomBasicInfo on room {
    id
    name
    space_id
    members {
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }
  }
`;

export const RoomDetailedInfoFragment = () => gql`
  ${TopicDetailedInfoFragment()}
  fragment RoomDetailedInfo on room {
    id
    name
    space_id
    members {
      user {
        id
        name
        avatarUrl: avatar_url
      }
    }

    topics {
      ...TopicDetailedInfo
    }
  }
`;

const RoomParticipantBasicInfoFragment = () => gql`
  fragment RoomParticipantBasicInfo on room_member {
    user {
      name
      avatarUrl: avatar_url
    }
  }
`;

export const [useGetSpaceRoomsQuery] = createQuery<GetRoomsQuery, GetRoomsQueryVariables>(
  () => gql`
    ${RoomBasicInfoFragment()}

    query GetRooms($spaceId: uuid!) {
      room(where: { space_id: { _eq: $spaceId } }) {
        ...RoomBasicInfo
      }
    }
  `
);

export const [useSingleRoomQuery, getSingleRoomManager] = createQuery<SingleRoomQuery, SingleRoomQueryVariables>(
  () => gql`
    ${RoomDetailedInfoFragment()}

    query SingleRoom($id: uuid!) {
      room: room_by_pk(id: $id) {
        ...RoomDetailedInfo
      }
    }
  `
);

export const [useCreateRoomMutation] = createMutation<CreateRoomMutation, CreateRoomMutationVariables>(
  () => gql`
    ${RoomDetailedInfoFragment()}

    mutation CreateRoom($name: String!, $spaceId: uuid!, $slug: String!) {
      room: insert_room_one(object: { name: $name, space_id: $spaceId, slug: $slug }) {
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
      members: room_member(where: { room_id: { _eq: $roomId } }) {
        ...RoomParticipantBasicInfo
      }
    }
  `
);

export const [useAddRoomMember] = createMutation<AddRoomMemberMutation, AddRoomMemberMutationVariables>(
  () => gql`
    mutation AddRoomMember($roomId: uuid!, $userId: uuid!) {
      insert_room_member_one(object: { room_id: $roomId, user_id: $userId }) {
        room_id
        user_id
      }
    }
  `
);

export const [useRemoveRoomMember] = createMutation<RemoveRoomMemberMutation, RemoveRoomMemberMutationVariables>(
  () => gql`
    mutation RemoveRoomMember($roomId: uuid!, $userId: uuid!) {
      delete_room_member(where: { room_id: { _eq: $roomId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `
);
