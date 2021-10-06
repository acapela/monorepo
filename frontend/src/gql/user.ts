import { gql } from "@apollo/client";

import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  UserBasicInfoFragment as UserBasicInfoFragmentType,
} from "~gql";

import { createFragment, createMutation } from "./utils";

export const UserBasicInfoFragment = createFragment<UserBasicInfoFragmentType>(
  () => gql`
    fragment UserBasicInfo on user {
      id
      name
      email
      avatar_url
    }
  `
);

export const [useChangeCurrentTeamIdMutation, { mutate: changeCurrentTeamId }] = createMutation<
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables
>(
  () => gql`
    mutation ChangeCurrentTeamId($userId: uuid!, $teamId: uuid) {
      update_user_by_pk(pk_columns: { id: $userId }, _set: { current_team_id: $teamId }) {
        id
        current_team {
          id
          name
          slug
        }
      }
    }
  `
);
