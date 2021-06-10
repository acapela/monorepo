import { gql } from "@apollo/client";
import { createMutation, createQuery } from "./utils";
import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  TeamMembersQuery,
  TeamMembersQueryVariables,
} from "./generated";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";

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

export const [useTeamMembers] = createQuery<TeamMembersQuery, TeamMembersQueryVariables>(
  () => gql`
    ${UserBasicInfoFragment()}

    query TeamMembers($teamId: uuid!) {
      teamMembers: user(where: { team_memberships: { team_id: { _eq: $teamId } } }) {
        ...UserBasicInfo
      }
    }
  `
);

export function useCurrentTeamMembers() {
  const teamId = useAssertCurrentTeamId();

  const [data] = useTeamMembers({ teamId: teamId });

  return data?.teamMembers ?? [];
}
