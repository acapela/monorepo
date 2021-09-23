import { gql } from "@apollo/client";

import {
  CreateRoomInvitationMutation,
  CreateRoomInvitationMutationVariables,
  RemoveRoomInvitationMutation,
  RemoveRoomInvitationMutationVariables,
  RoomInvitationBasicInfoFragment as RoomInvitationBasicInfoFragmentType,
} from "~gql";
import { addToast } from "~ui/toasts/data";

import { RoomDetailedInfoFragment } from "./rooms";
import { createFragment, createMutation } from "./utils";

export const RoomInvitationBasicInfoFragment = createFragment<RoomInvitationBasicInfoFragmentType>(
  () => gql`
    fragment RoomInvitationBasicInfo on room_invitation {
      email
      id
      used_at
    }
  `
);

export const [useCreateRoomInvitationMutation, { mutate: createRoomInvitation }] = createMutation<
  CreateRoomInvitationMutation,
  CreateRoomInvitationMutationVariables
>(
  () => gql`
    ${RoomInvitationBasicInfoFragment()}

    mutation CreateRoomInvitation($roomId: uuid!, $teamId: uuid!, $email: String!) {
      insert_room_invitation_one(object: { room_id: $roomId, team_id: $teamId, email: $email }) {
        ...RoomInvitationBasicInfo
      }
    }
  `,
  {
    onActualResponse() {
      addToast({ type: "success", title: `New room member was invited` });
    },
  }
);

export const [useRemoveRoomInvitation, { mutate: removeRoomInvitation }] = createMutation<
  RemoveRoomInvitationMutation,
  RemoveRoomInvitationMutationVariables
>(
  () => gql`
    mutation RemoveRoomInvitation($id: uuid!) {
      delete_room_invitation_by_pk(id: $id) {
        room_id
      }
    }
  `,
  {
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        delete_message_reaction_by_pk: {
          __typename: "room_invitation",
          id: variables.id,
        },
      };
    },
    onOptimisticOrActualResponse(roomInvitation, variables) {
      RoomDetailedInfoFragment.update(roomInvitation.room_id, (room) => {
        room.invitations = room.invitations.filter(({ id }) => id !== variables.id);
      });
    },
    onActualResponse() {
      addToast({ type: "success", title: `Room invitation was removed` });
    },
  }
);
