import { gql, useMutation } from "@apollo/client";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  CreateRoomMutation,
  CreateRoomMutationVariables,
  DeleteRoomMutation,
  DeleteRoomMutationVariables,
  IsCurrentUserRoomMember_RoomFragment,
  PrivateRoomInfoFragment as PrivateRoomInfoFragmentType,
  RoomBasicInfoFragment as RoomBasicInfoFragmentType,
  RoomDetailedInfoFragment as RoomDetailedInfoFragmentType,
  RoomsQuery,
  RoomsQueryVariables,
  SingleRoomQuery,
  SingleRoomQueryVariables,
} from "~gql";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

import { RoomInvitationBasicInfoFragment } from "./roomInvitations";
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
    mutation CreateRoom($input: room_insert_input!) {
      room: insert_room_one(object: $input) {
        id
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
    optimisticResponse: ({ input }) => ({
      __typename: "mutation_root",
      room: {
        __typename: "room",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: input.id!,
      },
    }),
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
