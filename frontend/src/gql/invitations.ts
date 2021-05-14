import { gql } from "@apollo/client";
import {
  AcceptInviteMutation,
  AcceptInviteMutationVariables,
  CreateInviteMutation,
  CreateInviteMutationVariables,
  GetRoomInvitesQuery,
  GetRoomInvitesQueryVariables,
} from "./generated";

import { createMutation, createQuery } from "./utils";

export const [useCreateInviteMutation] = createMutation<CreateInviteMutation, CreateInviteMutationVariables>(
  () => gql`
    mutation CreateInvite($email: String!, $roomId: uuid) {
      invite: insert_room_invites_one(object: { email: $email, room_id: $roomId }) {
        id
        email
        usedAt: used_at
      }
    }
  `
);

export const [useGetRoomInvitesQuery] = createQuery<GetRoomInvitesQuery, GetRoomInvitesQueryVariables>(
  () => gql`
    query GetRoomInvites($roomId: uuid!) {
      invites: room_invites(where: { room_id: { _eq: $roomId } }) {
        id
        email
        usedAt: used_at
      }
    }
  `
);

export const [useAcceptInviteMutation] = createMutation<AcceptInviteMutation, AcceptInviteMutationVariables>(
  () => gql`
    mutation AcceptInvite($code: String!) {
      invite: accept_invite(code: $code) {
        roomId: room_id
      }
    }
  `
);
