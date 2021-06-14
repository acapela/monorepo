import { gql } from "@apollo/client";
import { addToast } from "~ui/toasts/data";
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
  DeleteRoomMutation,
  DeleteRoomMutationVariables,
  UpdateRoomMutation,
  UpdateRoomMutationVariables,
  CloseOpenTopicsMutation,
  CloseOpenTopicsMutationVariables,
} from "./generated";
import { getSingleSpaceManager } from "./spaces";
import { TopicDetailedInfoFragment } from "./topics";
import { UserBasicInfoFragment } from "./user";

import { createMutation, createQuery } from "./utils";

export const RoomBasicInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  fragment RoomBasicInfo on room {
    id
    name
    space_id
    members {
      user {
        ...UserBasicInfo
      }
    }
  }
`;

export const RoomDetailedInfoFragment = () => gql`
  ${TopicDetailedInfoFragment()}
  ${UserBasicInfoFragment()}

  fragment RoomDetailedInfo on room {
    id
    name
    space_id
    deadline
    finished_at
    members {
      user {
        ...UserBasicInfo
      }
    }

    topics(order_by: { index: asc }) {
      ...TopicDetailedInfo
    }
  }
`;

const RoomParticipantBasicInfoFragment = () => gql`
  ${UserBasicInfoFragment()}
  fragment RoomParticipantBasicInfo on room_member {
    user {
      ...UserBasicInfo
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
  `,
  {
    onSuccess() {
      addToast({ type: "info", content: `Room member was added` });
    },
  }
);

export const [useRemoveRoomMember] = createMutation<RemoveRoomMemberMutation, RemoveRoomMemberMutationVariables>(
  () => gql`
    mutation RemoveRoomMember($roomId: uuid!, $userId: uuid!) {
      delete_room_member(where: { room_id: { _eq: $roomId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `,
  {
    onSuccess() {
      addToast({ type: "info", content: `Room member was removed` });
    },
  }
);

export const [useUpdateRoomMutation, { mutate: updateRoom }] = createMutation<
  UpdateRoomMutation,
  UpdateRoomMutationVariables
>(
  () => gql`
    ${RoomDetailedInfoFragment()}
    mutation UpdateRoom($roomId: uuid!, $input: room_set_input!) {
      room: update_room_by_pk(pk_columns: { id: $roomId }, _set: $input) {
        ...RoomDetailedInfo
      }
    }
  `
);

export const [useDeleteRoomMutation, { mutate: deleteRoom }] = createMutation<
  DeleteRoomMutation,
  DeleteRoomMutationVariables
>(
  () => gql`
    ${RoomDetailedInfoFragment()}
    mutation DeleteRoom($roomId: uuid!) {
      room: delete_room_by_pk(id: $roomId) {
        ...RoomDetailedInfo
      }
    }
  `
);

export const [useCloseOpenTopicsMutation] = createMutation<CloseOpenTopicsMutation, CloseOpenTopicsMutationVariables>(
  () => gql`
    mutation CloseOpenTopics($roomId: uuid!, $closedAt: timestamp, $closedByUserId: uuid) {
      update_topic(
        where: { room_id: { _eq: $roomId } }
        _set: { closed_at: $closedAt, closed_by_user_id: $closedByUserId }
      ) {
        affected_rows
      }
    }
  `
);
