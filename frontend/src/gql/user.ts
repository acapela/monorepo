import { gql } from "@apollo/client";
import { createFragment, createMutation, createQuery } from "./utils";
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
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";

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

export const [useChangeCurrentTeamIdMutation] = createMutation<
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
  // {
  //   optimisticResponse(vars) {
  //     return {
  //       __typename: "mutation_root",
  //       update_user_by_pk: {
  //         id: vars.userId,
  //         __typename: "user",
  //       },
  //     };
  //   },
  //   onOptimisticOrActualResponse(data, vars) {
  //     if (!data?.current_team) return;

  //     userDetailedInfoQuery.update({ id: vars.userId }, (draft) => {
  //       draft.user_by_pk?.current_team = data.current_team!;
  //     });
  //   },
  // }
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
