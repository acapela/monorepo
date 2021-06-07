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
} from "./generated";
import { createMutation, createQuery } from "./utils";
import { SpaceBasicInfoFragment } from "./spaces";
import { UserBasicInfoFragment } from "./user";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";

const TeamBasicInfoFragment = () => gql`
  fragment TeamBasicInfo on team {
    id
    name
    slug
  }
`;

const TeamInvitationBasicInfoFragment = () => gql`
  fragment TeamInvitationBasicInfo on team_invitation {
    email
    id
    used_at
  }
`;

const TeamDetailedInfoFragment = () => gql`
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
`;

export const [useCreateTeam] = createMutation<CreateTeamMutation, CreateTeamMutationVariables>(
  () => gql`
    ${TeamDetailedInfoFragment()}
    mutation CreateTeam($slug: String!, $name: String!) {
      insert_team_one(object: { slug: $slug, name: $name }) {
        ...TeamDetailedInfo
      }
    }
  `
);

export const [useTeams] = createQuery<TeamsQuery, TeamsQueryVariables>(
  () => gql`
    ${TeamBasicInfoFragment()}

    query Teams {
      teams: team {
        ...TeamBasicInfo
      }
    }
  `
);

export const [useTeamDetails] = createQuery<TeamDetailsQuery, TeamDetailsQueryVariables>(
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

  return useTeamDetails({ teamId });
}

export const [useCreateTeamInvitation] = createMutation<
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
  `
);
