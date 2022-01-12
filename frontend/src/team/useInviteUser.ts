import { gql, useMutation } from "@apollo/client";

import { InviteUserMutation, InviteUserMutationVariables } from "@aca/gql";

export const useInviteUser = () =>
  useMutation<InviteUserMutation, InviteUserMutationVariables>(gql`
    mutation InviteUser($input: InviteUserInput!) {
      invite_user(input: $input) {
        success
      }
    }
  `);
