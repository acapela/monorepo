import { gql } from "@apollo/client";
import {
  CreateRoomInvitationMutation,
  CreateRoomInvitationMutationVariables,
  RoomInvitationBasicInfoFragment as RoomInvitationBasicInfoFragmentType,
} from "~gql";
import { createMutation, createFragment } from "./utils";
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
