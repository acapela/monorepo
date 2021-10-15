import { gql, useMutation } from "@apollo/client";

import { ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables } from "~gql";

export const useChangeCurrentTeam = () =>
  useMutation<ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables>(gql`
    mutation ChangeCurrentTeamId($userId: uuid!, $teamId: uuid) {
      update_user_by_pk(pk_columns: { id: $userId }, _set: { current_team_id: $teamId }) {
        id
      }
    }
  `);
