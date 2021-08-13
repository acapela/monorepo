import { gql } from "@apollo/client";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateHomeviewQuery } from "~frontend/views/HomeView/query";
import {
  AddRoomMemberMutation,
  AddRoomMemberMutationVariables,
  CloseOpenTopicsMutation,
  CloseOpenTopicsMutationVariables,
  CreateRoomMutation,
  CreateRoomMutationVariables,
  DeleteRoomMutation,
  DeleteRoomMutationVariables,
  PrivateRoomInfoFragment as PrivateRoomInfoFragmentType,
  RemoveRoomMemberMutation,
  RemoveRoomMemberMutationVariables,
  RoomBasicInfoFragment as RoomBasicInfoFragmentType,
  RoomDetailedInfoFragment as RoomDetailedInfoFragmentType,
  RoomParticipantBasicInfoFragment as RoomParticipantBasicInfoFragmentType,
  RoomParticipantsQuery,
  RoomParticipantsQueryVariables,
  RoomsInSpaceQuery,
  RoomsInSpaceQueryVariables,
  RoomsQuery,
  RoomsQueryVariables,
  SinglePrivateRoomQuery,
  SinglePrivateRoomQueryVariables,
  SingleRoomQuery,
  SingleRoomQueryVariables,
  UpdateRoomMutation,
  UpdateRoomMutationVariables,
} from "~gql";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";
import { addToast } from "~ui/toasts/data";
import { RoomInvitationBasicInfoFragment } from "./roomInvitations";
import { SpaceDetailedInfoFragment } from "./spaces";
import { TopicDetailedInfoFragment } from "./topics";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";
import { getUpdatedDataWithInput } from "./utils/updateWithInput";

export const PrivateRoomInfoFragment = createFragment<PrivateRoomInfoFragmentType>(
  () => gql`
    fragment PrivateRoomInfo on room {
      id
      name
      is_private
    }
  `
);

export const RoomBasicInfoFragment = createFragment<RoomBasicInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    ${PrivateRoomInfoFragment()}

    fragment RoomBasicInfo on room {
      ...PrivateRoomInfo

      space_id
      deadline
      summary
      finished_at
      source_google_calendar_event_id
      last_activity_at

      owner {
        ...UserBasicInfo
      }

      members {
        user {
          ...UserBasicInfo
        }
      }

      space {
        id
        name
      }
    }
  `
);

export const RoomDetailedInfoFragment = createFragment<RoomDetailedInfoFragmentType>(
  () => gql`
    ${TopicDetailedInfoFragment()}
    ${UserBasicInfoFragment()}
    ${RoomBasicInfoFragment()}
    ${RoomInvitationBasicInfoFragment()}

    fragment RoomDetailedInfo on room {
      ...RoomBasicInfo

      topics(order_by: { index: asc }) {
        ...TopicDetailedInfo
      }

      invitations(where: { used_at: { _is_null: true } }) {
        ...RoomInvitationBasicInfo
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

export const [useSpaceRoomsQuery] = createQuery<RoomsInSpaceQuery, RoomsInSpaceQueryVariables>(
  () => gql`
    ${RoomBasicInfoFragment()}

    query RoomsInSpace($spaceId: uuid!) {
      room(where: { space_id: { _eq: $spaceId } }) {
        ...RoomBasicInfo
      }
    }
  `
);

export const [useRoomsQuery, roomsQueryManager] = createQuery<RoomsQuery, RoomsQueryVariables>(
  () => gql`
    ${RoomDetailedInfoFragment()}

    query Rooms($limit: Int, $orderBy: [room_order_by!], $where: room_bool_exp) {
      rooms: room(where: $where, limit: $limit, order_by: $orderBy) {
        ...RoomDetailedInfo
      }
    }
  `
);

export const [usePrivateRoomQuery, { fetch: fetchPrivateRoom }] = createQuery<
  SinglePrivateRoomQuery,
  SinglePrivateRoomQueryVariables
>(
  () => gql`
    ${PrivateRoomInfoFragment()}

    query SinglePrivateRoom($id: uuid!) {
      privateRoom: room_by_pk(id: $id) {
        ...PrivateRoomInfo
      }
    }
  `,
  {
    requestWithRole: "visitor",
  }
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

export function isCurrentUserRoomMember(room?: RoomBasicInfoFragmentType) {
  const user = useAssertCurrentUser();

  return room?.members.some((member) => member.user.id === user.id) ?? false;
}

export const [useCreateRoomMutation, { mutate: createRoom }] = createMutation<
  CreateRoomMutation,
  CreateRoomMutationVariables
>(
  () => gql`
    ${RoomDetailedInfoFragment()}

    mutation CreateRoom($input: room_insert_input!) {
      room: insert_room_one(object: $input) {
        ...RoomDetailedInfo
      }
    }
  `,
  {
    defaultVariables() {
      return {
        input: { id: getUUID() },
      };
    },
    inputMapper({ input }) {
      if (input.name && !input.slug) {
        input.slug = slugify(input.name);
      }
    },
    onOptimisticOrActualResponse(room, variables) {
      if (!room || !variables.input.space_id) return;

      SpaceDetailedInfoFragment.update(variables.input.space_id, (space) => {
        space.rooms.push(room);
      });

      updateHomeviewQuery((result) => {
        result.rooms.push(room);
      });
    },
    optimisticResponse({ input }) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const spaceId = input.space_id!;

      return {
        __typename: "mutation_root",
        room: {
          __typename: "room",
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          deadline: input.deadline!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: input.id!,
          members: [],
          invitations: [],
          space: SpaceDetailedInfoFragment.assertRead(spaceId),
          topics: [],
          last_activity_at: null,
          is_private: input.is_private ?? false,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: input.name!,
          space_id: spaceId,
          finished_at: null,
          source_google_calendar_event_id: input.source_google_calendar_event_id ?? null,
          summary: input.summary ?? null,
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
    onOptimisticOrActualResponse(data, vars) {
      RoomDetailedInfoFragment.update(vars.roomId, (room) => {
        room.members.push({ __typename: "room_member", user: UserBasicInfoFragment.assertRead(vars.userId) });
      });
    },
    onActualResponse() {
      addToast({ type: "success", title: `Room member was added` });
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
    onOptimisticOrActualResponse(data, vars) {
      RoomDetailedInfoFragment.update(vars.roomId, (room) => {
        room.members = room.members.filter((member) => member.user.id !== vars.userId);
      });
    },
    onActualResponse() {
      addToast({ type: "success", title: `Room member was removed` });
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
      const existingData = RoomDetailedInfoFragment.assertRead(vars.roomId);
      const newData = getUpdatedDataWithInput(existingData, vars.input);

      return {
        __typename: "mutation_root",
        room: newData,
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
    onOptimisticOrActualResponse(removedRoom) {
      if (!removedRoom.space_id) return;
      SpaceDetailedInfoFragment.update(removedRoom.space_id, (space) => {
        space.rooms = space.rooms.filter((room) => room.id !== removedRoom.id);
      });

      updateHomeviewQuery((result) => {
        result.rooms = result.rooms.filter((room) => room.id !== removedRoom.id);
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
