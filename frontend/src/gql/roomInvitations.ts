import { gql } from "@apollo/client";
import {
  CreateRoomInvitationMutation,
  CreateRoomInvitationMutationVariables,
  RoomInvitationBasicInfoFragment as RoomInvitationBasicInfoFragmentType,
  RoomInvitationsQuery,
  RoomInvitationsQueryVariables,
} from "~gql";
import { createMutation, createFragment, createQuery } from "./utils";
import { addToast } from "~ui/toasts/data";

const RoomInvitationBasicInfoFragment = createFragment<RoomInvitationBasicInfoFragmentType>(
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

    mutation CreateRoomInvitation($roomId: uuid!, $email: String!) {
      insert_room_invitation_one(object: { room_id: $roomId, email: $email }) {
        ...RoomInvitationBasicInfo
      }
    }
  `,
  {
    onActualResponse() {
      addToast({ type: "info", content: `New room member was invited` });
    },
  }
);

export const [useRoomInvitationsQuery] = createQuery<RoomInvitationsQuery, RoomInvitationsQueryVariables>(
  () => gql`
    ${RoomInvitationBasicInfoFragment()}

    query RoomInvitations($roomId: uuid!) {
      invitations: room_invitation(where: { room_id: { _eq: $roomId } }, order_by: [{ created_at: desc }]) {
        ...RoomInvitationBasicInfo
      }
    }
  `
);
