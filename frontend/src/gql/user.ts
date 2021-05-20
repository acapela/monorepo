import { gql } from "@apollo/client";
import { createMutation } from "./utils";
import { ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables } from "./generated";

export const UserBasicInfoFragment = () => gql`
  fragment UserBasicInfo on user {
    id
    name
    avatar_url
  }
`;

export const [useChangeCurrentTeamId] = createMutation<
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables
>(
  () => gql`
    mutation ChangeCurrentTeamId($userId: uuid!, $teamId: uuid!) {
      update_user_by_pk(pk_columns: { id: $userId }, _set: { current_team_id: $teamId }) {
        id
      }
    }
  `
);
