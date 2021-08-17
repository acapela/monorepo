import { gql } from "@apollo/client";

import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  TeamMembersQuery,
  TeamMembersQueryVariables,
  UserBasicInfoFragment as UserBasicInfoFragmentType,
  UserDetailedInfoFragment as UserDetailedInfoFragmentType,
  UserDetailedQuery,
  UserDetailedQueryVariables,
} from "~gql";
import { UserTokenData } from "~shared/types/jwtAuth";

import { TeamBasicInfoFragment } from "./teams";
import { createFragment, createMutation, createQuery } from "./utils";

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

export const UserDetailedInfoFragment = createFragment<UserDetailedInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    ${TeamBasicInfoFragment()}

    fragment UserDetailedInfo on user {
      ...UserBasicInfo
      current_team {
        ...TeamBasicInfo
      }
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

export const [useUserDetailedInfoQuery, userDetailedInfoQuery] = createQuery<
  UserDetailedQuery,
  UserDetailedQueryVariables
>(
  () => gql`
    ${UserDetailedInfoFragment()}

    query UserDetailed($id: uuid!) {
      user_by_pk(id: $id) {
        ...UserDetailedInfo
      }
    }
  `
);
