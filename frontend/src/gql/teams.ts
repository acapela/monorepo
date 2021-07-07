import { gql } from "@apollo/client";
import {
  CreateTeamMutation,
  CreateTeamMutationVariables,
  TeamsQuery,
  TeamsQueryVariables,
  TeamDetailsQuery,
  TeamDetailsQueryVariables,
  CreateTeamInvitationMutation,
  CreateTeamInvitationMutationVariables,
  TeamInvitationQuery,
  TeamInvitationQueryVariables,
  TeamBasicInfoFragment as TeamBasicInfoFragmentType,
  TeamInvitationBasicInfoFragment as TeamInvitationBasicInfoFragmentType,
  TeamDetailedInfoFragment as TeamDetailedInfoFragmentType,
  UserBasicInfoFragment as UserBasicInfoFragmentType,
} from "~gql";
import { createFragment, createMutation, createQuery } from "./utils";
import { SpaceBasicInfoFragment } from "./spaces";
import { UserBasicInfoFragment } from "./user";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { addToast } from "~ui/toasts/data";

const TeamBasicInfoFragment = createFragment<TeamBasicInfoFragmentType>(
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
    ${SpaceBasicInfoFragment()}
    ${UserBasicInfoFragment()}
    ${TeamInvitationBasicInfoFragment()}

    fragment TeamDetailedInfo on team {
      id
      name
      slug
      spaces {
        ...SpaceBasicInfo
      }
      invitations {
        ...TeamInvitationBasicInfo
      }
      memberships {
        user {
          ...UserBasicInfo
        }
      }
    }
  `
);

export const [useCreateTeamMutation] = createMutation<CreateTeamMutation, CreateTeamMutationVariables>(
  () => gql`
    ${TeamDetailedInfoFragment()}
    mutation CreateTeam($slug: String!, $name: String!) {
      insert_team_one(object: { slug: $slug, name: $name }) {
        ...TeamDetailedInfo
      }
    }
  `
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

export function useCurrentTeamDetails() {
  const teamId = useAssertCurrentTeamId();

  return useTeamDetailsQuery({ teamId });
}

export function useCurrentTeamMembers(): UserBasicInfoFragmentType[] {
  const [teamDetails] = useCurrentTeamDetails();

  return teamDetails?.memberships.map((membership) => membership.user) ?? [];
}

export const [useCreateTeamInvitationMutation] = createMutation<
  CreateTeamInvitationMutation,
  CreateTeamInvitationMutationVariables
>(
  () => gql`
    ${TeamInvitationBasicInfoFragment()}
    mutation CreateTeamInvitation($teamId: uuid!, $email: String!) {
      insert_team_invitation_one(object: { team_id: $teamId, email: $email }) {
        ...TeamInvitationBasicInfo
      }
    }
  `,
  {
    onActualResponse() {
      addToast({ type: "info", content: `New team member was invited` });
    },
  }
);

export const [useTeamInvitationByTokenQuery] = createQuery<TeamInvitationQuery, TeamInvitationQueryVariables>(
  () => gql`
    query TeamInvitation($tokenId: uuid!) {
      team_invitation(where: { token: { _eq: $tokenId } }) {
        id
        team_id
        token
        used_by_user_id
      }
    }
  `
);
