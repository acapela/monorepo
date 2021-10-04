import { gql, useSubscription } from "@apollo/client";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { removeTeamInvitation, removeTeamMember } from "~frontend/gql/teams";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { getTeamInvitationDisplayName } from "~frontend/utils/getTeamInvitationDisplayName";
import { CurrentTeamMembersManagerSubscription, CurrentTeamMembersManagerSubscriptionVariables } from "~gql";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { theme } from "~ui/theme";

import { ExitTeamButton } from "./ExitTeamButton";
import { InvitationPendingIndicator } from "./InvitationPendingIndicator";
import { InviteMemberForm } from "./InviteMemberForm";
import { ResendInviteButton } from "./ResendInviteButton";
import { SlackInstallationButton } from "./SlackInstallationButton";

export const CurrentTeamMembersManager = () => {
  const teamId = useAssertCurrentTeamId();
  const { data: teamData } = useSubscription<
    CurrentTeamMembersManagerSubscription,
    CurrentTeamMembersManagerSubscriptionVariables
  >(
    gql`
      ${UserBasicInfo.fragments.user}
      ${SlackInstallationButton.fragments.team}

      subscription CurrentTeamMembersManager($teamId: uuid!) {
        team: team_by_pk(id: $teamId) {
          id
          name
          owner_id

          ...SlackInstallationButton_team

          memberships {
            id
            user {
              id
              email
              ...UserBasicInfo_user
            }
          }

          invitations(where: { used_at: { _is_null: true } }) {
            id
            email
            slack_user_id
          }
        }
      }
    `,
    { variables: { teamId } }
  );
  const team = teamData?.team;
  const currentUser = useAssertCurrentUser();
  const isCurrentUserTeamOwner = currentUser.id === team?.owner_id;

  if (!team) {
    return null;
  }

  const teamMembers = team.memberships.map((membership) => membership.user) ?? [];
  const teamMembersEmails = new Set(teamMembers.map(({ email }) => email));

  const handleRemoveTeamMember = (userId: string) => {
    if (!team) return;
    removeTeamMember({ userId, teamId: team.id });
    trackEvent("Account Removed User", { teamId: team.id, userId });
  };

  const invitations = team.invitations ?? [];
  const pendingInvitations = invitations.filter(({ email }) => !teamMembersEmails.has(email));

  const handleRemoveInvitation = (invitationId: string) => {
    if (!team) return;
    removeTeamInvitation({ id: invitationId });
    trackEvent("Deleted Team Invitation", { teamId: team.id, invitationId });
  };

  return (
    <UIPanel>
      <UIHeader>
        <UITitle>{team.name} members</UITitle>
        <ExitTeamButton />
      </UIHeader>
      {team && <SlackInstallationButton {...{ team, isCurrentUserTeamOwner }} />}
      <InviteMemberForm />
      {teamMembers.length > 0 && (
        <UISelectGridContainer>
          {teamMembers.map((user) => (
            <UIItemHolder key={user.id}>
              <UserBasicInfo user={user} />
              {!(user.id === team.owner_id) && (
                <CircleCloseIconButton
                  isDisabled={!isCurrentUserTeamOwner}
                  onClick={() => handleRemoveTeamMember(user.id)}
                  tooltip={isCurrentUserTeamOwner ? undefined : "Only team owner can delete members"}
                />
              )}
            </UIItemHolder>
          ))}
          {pendingInvitations.map((invitation) => (
            <UIItemHolder key={invitation.id}>
              <InvitationPendingIndicator label={invitation.email || getTeamInvitationDisplayName(invitation)} />
              <UIActionsHolder>
                <ResendInviteButton invitationId={invitation.id} />
                <CircleCloseIconButton
                  isDisabled={!isCurrentUserTeamOwner}
                  onClick={() => handleRemoveInvitation(invitation.id)}
                  tooltip={!isCurrentUserTeamOwner ? "Only team owner can delete invitations" : undefined}
                />
              </UIActionsHolder>
            </UIItemHolder>
          ))}
        </UISelectGridContainer>
      )}
    </UIPanel>
  );
};

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  background: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.modal};
  ${theme.shadow.popover}

  width: 534px;
  @media (max-width: 560px) {
    width: 100%;
  }
`;

const UIHeader = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
`;

const UITitle = styled.h3<{}>`
  ${theme.font.h3.spezia.build()};
`;

const UIItemHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
`;

const UIActionsHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UISelectGridContainer = styled.div<{}>`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 8px;
  border: 1px solid ${theme.colors.layout.softLine()};
  ${theme.borderRadius.menu}
`;
