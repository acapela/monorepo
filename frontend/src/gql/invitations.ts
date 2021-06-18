import { gql } from "@apollo/client";
import {
  AcceptInviteMutation,
  AcceptInviteMutationVariables,
  CreateInviteMutation,
  CreateInviteMutationVariables,
} from "~gql";

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

export const [useAcceptInviteMutation] = createMutation<AcceptInviteMutation, AcceptInviteMutationVariables>(
  () => gql`
    mutation AcceptInvite($token: String!) {
      invite: accept_invite(token: $token) {
        team {
          id
        }
      }
    }
  `
);

export const [lookupTeamName] = createQuery<LookupTeamNameQuery, LookupTeamNameVariables>(
  () => gql`
    query LookupTeamName($token: String!) {
      invite: lookup_team_name(token: $token) {
        team_name
        inviter_name
      }
    }
  `
);
