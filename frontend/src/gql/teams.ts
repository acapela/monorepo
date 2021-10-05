import { gql } from "@apollo/client";

import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  CreateTeamMutation,
  CreateTeamMutationVariables,
  TeamBasicInfoFragment as TeamBasicInfoFragmentType,
  TeamBasicInfoQuery,
  TeamBasicInfoQueryVariables,
  TeamDetailedInfoFragment as TeamDetailedInfoFragmentType,
  TeamDetailsQuery,
  TeamDetailsQueryVariables,
  TeamInvitationBasicInfoFragment as TeamInvitationBasicInfoFragmentType,
  TeamsQuery,
  TeamsQueryVariables,
  UserBasicInfoFragment as UserBasicInfoFragmentType,
} from "~gql";
import { slugify } from "~shared/slugify";

import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";

export const TeamBasicInfoFragment = createFragment<TeamBasicInfoFragmentType>(
  () => gql`
    fragment TeamBasicInfo on team {
      id
      name
      slug
    }
  `
);

const TeamInvitationBasicInfoFragment = createFragment<TeamInvitationBasicInfoFragmentType>(
  () => gql`
    fragment TeamInvitationBasicInfo on team_invitation {
      email
      id
      used_at
    }
  `
);

export const TeamDetailedInfoFragment = createFragment<TeamDetailedInfoFragmentType>(
  () => gql`
    ${UserBasicInfoFragment()}
    ${TeamInvitationBasicInfoFragment()}

    fragment TeamDetailedInfo on team {
      id
      name
      slug
      owner_id
      invitations(where: { used_at: { _is_null: true } }) {
        ...TeamInvitationBasicInfo
      }
      memberships {
        user {
          ...UserBasicInfo
        }
      }
      slack_installation {
        team_id
      }
    }
  `
);

export const [useCreateTeamMutation, { mutate: createTeam }] = createMutation<
  CreateTeamMutation,
  CreateTeamMutationVariables
>(
  () => gql`
    ${TeamDetailedInfoFragment()}
    mutation CreateTeam($input: team_insert_input!) {
      insert_team_one(object: $input) {
        ...TeamDetailedInfo
      }
    }
  `,
  {
    inputMapper({ input }) {
      if (input.name && !input.slug) {
        input.slug = slugify(input.name);
      }
    },
  }
);

export const [useTeamsQuery] = createQuery<TeamsQuery, TeamsQueryVariables>(
  () => gql`
    ${TeamBasicInfoFragment()}

    query Teams {
      teams: team {
        ...TeamBasicInfo
      }
    }
  `
);

export const [useTeamDetailsQuery] = createQuery<TeamDetailsQuery, TeamDetailsQueryVariables>(
  () => gql`
    ${TeamDetailedInfoFragment()}
    query TeamDetails($teamId: uuid!) {
      team: team_by_pk(id: $teamId) {
        ...TeamDetailedInfo
      }
    }
  `
);

export const [useTeamBasicInfoQuery, { fetch: fetchTeamBasicInfoQuery }] = createQuery<
  TeamBasicInfoQuery,
  TeamBasicInfoQueryVariables
>(
  () => gql`
    ${TeamBasicInfoFragment()}
    query TeamBasicInfo($teamId: uuid!) {
      team: team_by_pk(id: $teamId) {
        ...TeamBasicInfo
      }
    }
  `
);

export function useCurrentTeamDetails() {
  const teamId = useAssertCurrentTeamId();

  return useTeamDetailsQuery({ teamId });
}

export function useCurrentTeamMembers(): UserBasicInfoFragmentType[] {
  const [teamDetails] = useCurrentTeamDetails();

  return teamDetails?.memberships.map((membership) => membership.user) ?? [];
}
