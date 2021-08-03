import { gql } from "@apollo/client";
import { createFragment, createMutation, createQuery } from "./utils";
import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  TeamMembersQuery,
  TeamMembersQueryVariables,
  UserBasicInfoFragment as UserBasicInfoFragmentType,
} from "~gql";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { UserTokenData } from "~frontend/../../shared/types/jwtAuth";

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

export const [useChangeCurrentTeamIdMutation] = createMutation<
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

export const [useTeamMembersQuery] = createQuery<TeamMembersQuery, TeamMembersQueryVariables>(
  () => gql`
    ${UserBasicInfoFragment()}

    query TeamMembers($teamId: uuid!) {
      teamMembers: user(where: { team_memberships: { team_id: { _eq: $teamId } } }) {
        ...UserBasicInfo
      }
    }
  `
);

export function useCurrentTeamMembers(): UserBasicInfoFragmentType[] {
  const teamId = useAssertCurrentTeamId();

  const [teamMembers = []] = useTeamMembersQuery({ teamId: teamId });

  return teamMembers;
}

export function convertUserTokenDataToInfoFragment(userTokenData: UserTokenData): UserBasicInfoFragmentType {
  return {
    id: userTokenData.id,
    __typename: "user",
    avatar_url: userTokenData.picture,
    email: userTokenData.email,
    name: userTokenData.name,
  };
}
