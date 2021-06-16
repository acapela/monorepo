import { gql } from "@apollo/client";
import { addToast } from "~ui/toasts/data";
import {
  CreateRoomMutation,
  CreateRoomMutationVariables,
  RoomsQuery,
  RoomsQueryVariables,
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
  RoomBasicInfoFragment as RoomBasicInfoFragmentType,
  RoomDetailedInfoFragment as RoomDetailedInfoFragmentType,
  RoomParticipantBasicInfoFragment as RoomParticipantBasicInfoFragmentType,
} from "~gql";
import { SpaceDetailedInfoFragment } from "./spaces";
import { TopicDetailedInfoFragment } from "./topics";
import { UserBasicInfoFragment } from "./user";
import { createMutation, createQuery, createFragment } from "./utils";
import { getUUID } from "~shared/uuid";
import { removeUndefinedFromObject } from "~frontend/../../shared/object";

export const RoomBasicInfoFragment = createFragment<RoomBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    fragment RoomBasicInfo on room {
      id
      name
      space_id
      deadline
      summary
      finished_at
      members {
        user {
          ...UserBasicInfo
        }
      }
    }
  `
);

export const RoomDetailedInfoFragment = createFragment<RoomDetailedInfoFragmentType>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    ${UserBasicInfoFragment()}
    ${RoomBasicInfoFragment()}

    fragment RoomDetailedInfo on room {
      ...RoomBasicInfo

      topics(order_by: { index: asc }) {
        ...TopicDetailedInfo
      }
    }
  `
);

const RoomParticipantBasicInfoFragment = createFragment<RoomParticipantBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    fragment RoomParticipantBasicInfo on room_member {
      user {
        ...UserBasicInfo
      }
    }
  `
);

export const [useSpaceRoomsQuery] = createQuery<RoomsQuery, RoomsQueryVariables>(
  () => gql`
    ${RoomBasicInfoFragment()}

    query Rooms($spaceId: uuid!) {
      room(where: { space_id: { _eq: $spaceId } }) {
        ...RoomBasicInfo
      }
    }
  `
);

export const [useSingleRoomQuery, getSingleRoomQueryManager] = createQuery<SingleRoomQuery, SingleRoomQueryVariables>(
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
    onResult(room, variables) {
      if (!room) return;

      SpaceDetailedInfoFragment.update(variables.spaceId, (space) => {
        space.rooms.push(room);
      });
    },
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        room: {
          __typename: "room",
          deadline: new Date(),
          id: getUUID(),
          members: [],
          topics: [],
          name: variables.name,
          space_id: variables.spaceId,
        },
      };
    },
  }
);

export const [useRoomParticipantsQuery] = createQuery<RoomParticipantsQuery, RoomParticipantsQueryVariables>(
  () => gql`
    ${RoomParticipantBasicInfoFragment()}

    query RoomParticipants($roomId: uuid!) {
      members: room_member(where: { room_id: { _eq: $roomId } }) {
        ...RoomParticipantBasicInfo
      }
    }
  `
);

export const [useAddRoomMemberMutation] = createMutation<AddRoomMemberMutation, AddRoomMemberMutationVariables>(
  () => gql`
    mutation AddRoomMember($roomId: uuid!, $userId: uuid!) {
      insert_room_member_one(object: { room_id: $roomId, user_id: $userId }) {
        room_id
        user_id
      }
    }
  `,
  {
    optimisticResponse(vars) {
      return {
        __typename: "mutation_root",
        insert_room_member_one: { __typename: "room_member", user_id: vars.userId, room_id: vars.roomId },
      };
    },
    onResult(data, vars) {
      RoomDetailedInfoFragment.update(vars.roomId, (room) => {
        room.members.push({ __typename: "room_member", user: UserBasicInfoFragment.assertRead(vars.userId) });
      });
      addToast({ type: "info", content: `Room member was added` });
    },
  }
);

export const [useRemoveRoomMemberMutation] = createMutation<
  RemoveRoomMemberMutation,
  RemoveRoomMemberMutationVariables
>(
  () => gql`
    mutation RemoveRoomMember($roomId: uuid!, $userId: uuid!) {
      delete_room_member(where: { room_id: { _eq: $roomId }, user_id: { _eq: $userId } }) {
        affected_rows
      }
    }
  `,
  {
    optimisticResponse() {
      return {
        __typename: "mutation_root",
        delete_room_member: { __typename: "room_member_mutation_response", affected_rows: 1 },
      };
    },
    onResult(data, vars) {
      RoomDetailedInfoFragment.update(vars.roomId, (room) => {
        room.members = room.members.filter((member) => member.user.id !== vars.userId);
      });
      addToast({ type: "info", content: `Room member was added` });
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
  `,
  {
    optimisticResponse(vars) {
      const { name, slug, summary, deadline, finished_at } = removeUndefinedFromObject(vars.input);
      const inputToReplace = removeUndefinedFromObject({ name, slug, summary, deadline, finished_at });

      const existingData = RoomDetailedInfoFragment.assertRead(vars.roomId);
      return {
        __typename: "mutation_root",
        room: {
          __typename: "room",

          ...existingData,
          ...inputToReplace,
          deadline: deadline ?? existingData.deadline,
        },
      };
    },
  }
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
  `,
  {
    optimisticResponse(vars) {
      return {
        __typename: "mutation_root",
        room: RoomDetailedInfoFragment.assertRead(vars.roomId),
      };
    },
    onResult(removedRoom) {
      if (!removedRoom.space_id) return;
      SpaceDetailedInfoFragment.update(removedRoom.space_id, (space) => {
        space.rooms = space.rooms.filter((room) => room.id !== removedRoom.id);
      });
    },
  }
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
