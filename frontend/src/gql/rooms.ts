import { gql, useMutation } from "@apollo/client";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateHomeviewQuery } from "~frontend/views/HomeView/query";
import {
  CreateRoomMutation,
  CreateRoomMutationVariables,
  DeleteRoomMutation,
  DeleteRoomMutationVariables,
  IsCurrentUserRoomMember_RoomFragment,
  PrivateRoomInfoFragment as PrivateRoomInfoFragmentType,
  RoomBasicInfoFragment as RoomBasicInfoFragmentType,
  RoomDetailedInfoFragment as RoomDetailedInfoFragmentType,
  RoomsInSpaceQuery,
  RoomsInSpaceQueryVariables,
  RoomsQuery,
  RoomsQueryVariables,
  SinglePrivateRoomQuery,
  SinglePrivateRoomQueryVariables,
  SingleRoomQuery,
  SingleRoomQueryVariables,
} from "~gql";
import { assert } from "~shared/assert";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

import { RoomInvitationBasicInfoFragment } from "./roomInvitations";
import { SpaceDetailedInfoFragment } from "./spaces";
import { TopicDetailedInfoFragment } from "./topics";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery, withFragments } from "./utils";

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

export const useIsCurrentUserRoomMember = withFragments(
  {
    room: gql`
      fragment IsCurrentUserRoomMember_room on room {
        members {
          user {
            id
          }
        }
      }
    `,
  },
  function useIsCurrentUserRoomMember(room?: IsCurrentUserRoomMember_RoomFragment) {
    const user = useAssertCurrentUser();
    return room?.members.some((member) => member.user.id === user.id) ?? false;
  }
);

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

      assert(input.owner_id, "No owner id");

      return {
        __typename: "mutation_root",
        room: {
          __typename: "room",
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          deadline: input.deadline!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: input.id!,
          owner: UserBasicInfoFragment.assertRead(input.owner_id),
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

export const useDeleteRoom = () =>
  useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(gql`
    mutation DeleteRoom($id: uuid!) {
      room: delete_room_by_pk(id: $id) {
        id
      }
    }
  `);
