import { gql } from "@apollo/client";

import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  CreateTeamInvitationMutation,
  CreateTeamInvitationMutationVariables,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  LookupTeamNameQuery,
  LookupTeamNameQueryVariables,
  RemoveTeamInvitationMutation,
  RemoveTeamInvitationMutationVariables,
  RemoveTeamMemberMutation,
  RemoveTeamMemberMutationVariables,
  ResendInvitationMutation,
  ResendInvitationMutationVariables,
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
import { addToast } from "~ui/toasts/data";

import { SpaceBasicInfoFragment } from "./spaces";
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
    ${SpaceBasicInfoFragment()}
    ${UserBasicInfoFragment()}
    ${TeamInvitationBasicInfoFragment()}

    fragment TeamDetailedInfo on team {
      id
      name
      slug
      owner_id
      spaces {
        ...SpaceBasicInfo
      }
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

export const [useCreateTeamMutation] = createMutation<CreateTeamMutation, CreateTeamMutationVariables>(
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

export function useCurrentTeamMember(userId: string): [UserBasicInfoFragmentType | null, boolean] {
  const [teamDetails, { loading }] = useCurrentTeamDetails();

  const teamMember = teamDetails?.memberships.find((membership) => membership.user.id === userId)?.user;

  const teamMemberData = teamMember ?? null;

  return [teamMemberData, loading];
}

export const [useCreateTeamInvitationMutation, { mutate: createTeamIvitation }] = createMutation<
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

export const [useRemoveTeamInvitation, { mutate: removeTeamInvitation }] = createMutation<
  RemoveTeamInvitationMutation,
  RemoveTeamInvitationMutationVariables
>(
  () => gql`
    mutation RemoveTeamInvitation($id: uuid!) {
      delete_team_invitation_by_pk(id: $id) {
        team_id
      }
    }
  `,
  {
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        delete_message_reaction_by_pk: {
          __typename: "team_invitation",
          id: variables.id,
        },
      };
    },
    onOptimisticOrActualResponse(teamInvitation, variables) {
      TeamDetailedInfoFragment.update(teamInvitation.team_id, (team) => {
        team.invitations = team.invitations.filter(({ id }) => id !== variables.id);
      });
    },
    onActualResponse() {
      addToast({ type: "info", content: `Team invitation was removed` });
    },
  }
);

export const [useRemoveTeamMember, { mutate: removeTeamMember }] = createMutation<
  RemoveTeamMemberMutation,
  RemoveTeamMemberMutationVariables
>(
  () => gql`
    mutation RemoveTeamMember($teamId: uuid!, $userId: uuid!) {
      delete_team_member(where: { team_id: { _eq: $teamId }, user_id: { _eq: $userId } }) {
        returning {
          user_id
        }
      }
    }
  `,
  {
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        delete_message_reaction_by_pk: {
          __typename: "team_member",
          team_id: variables.teamId,
          user_id: variables.userId,
        },
      };
    },
    onOptimisticOrActualResponse(teamMember, variables) {
      TeamDetailedInfoFragment.update(variables.teamId, (team) => {
        team.memberships = team.memberships.filter((member) => member.user.id !== variables.userId);
      });
    },
    onActualResponse() {
      addToast({ type: "info", content: `Team member was removed` });
    },
  }
);

export const [lookupTeamName] = createQuery<LookupTeamNameQuery, LookupTeamNameQueryVariables>(
  () => gql`
    query LookupTeamName($token: String!) {
      invite: lookup_team_name(token: $token) {
        team_name
        inviter_name
        email
      }
    }
  `
);

export const [useResendInvitation] = createMutation<ResendInvitationMutation, ResendInvitationMutationVariables>(
  () => gql`
    mutation ResendInvitation($invitation_id: ID!) {
      resend_invitation(invitation_id: $invitation_id) {
        sent_at
      }
    }
  `,
  {
    onActualResponse() {
      addToast({ type: "info", content: `Team invitation was sent` });
    },
  }
);
