import { observer } from "mobx-react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { useCurrentTeam } from "~frontend/team/useCurrentTeamId";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { getTeamInvitationDisplayName } from "~frontend/utils/getTeamInvitationDisplayName";
import { assert } from "~shared/assert";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { theme } from "~ui/theme";

import { InvitationPendingIndicator } from "./InvitationPendingIndicator";
import { InviteMemberForm } from "./InviteMemberForm";
import { ResendInviteButton } from "./ResendInviteButton";
import { SlackInstallationButton } from "./SlackInstallationButton";

export const CurrentTeamMembersManager = observer(() => {
  const db = useDb();
  const team = useCurrentTeam();
  const currentUser = useAssertCurrentUser();

  if (!team) {
    return null;
  }

  const isCurrentUserTeamOwner = currentUser.id === team.owner_id;

  const teamUsers = team.members.all.map((teamMember) => teamMember.user) ?? [];

  const handleRemoveTeamMember = (userId: string) => {
    const teamMember = team.members.query((teamMember) => teamMember.user_id === userId).all[0];
    assert(teamMember, "did not find teamMember");
    teamMember.remove();
    trackEvent("Account Removed User", { teamId: team.id, userId });
  };

  const pendingInvitations = team.invitations.query(({ usedByUser }) => !usedByUser).all;

  const handleRemoveInvitation = (invitationId: string) => {
    if (!team) return;
    db.teamInvitation.findById(invitationId)?.remove();
    trackEvent("Deleted Team Invitation", { teamId: team.id, invitationId });
  };

  return (
    <UIPanel>
      <UIHeader>
        <UITitle>{team.name} Team</UITitle>
      </UIHeader>
      {team && <SlackInstallationButton {...{ team, isCurrentUserTeamOwner }} />}
      <InviteMemberForm />
      {teamUsers.length > 0 && (
        <UISelectGridContainer>
          {teamUsers.map((user) => (
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
});

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.panel};

  width: 100%;
`;

const UIHeader = styled.div<{}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
`;

const UITitle = styled.h3<{}>`
  ${theme.typo.secondaryTitle};
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
  border: 1px solid ${theme.colors.layout.background.border};
  ${theme.radius.menu}
`;
