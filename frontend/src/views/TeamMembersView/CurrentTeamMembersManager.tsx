import styled from "styled-components";
import { PanelWithTopbarAndCloseButton } from "~frontend/ui/MembersManager/PanelWithTopbarAndCloseButton";
import { removeTeamMember, useCurrentTeamDetails, removeTeamInvitation } from "~frontend/gql/teams";
import { UISelectGridContainer } from "~frontend/ui/MembersManager/UISelectGridContainer";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { InviteMemberForm } from "./InviteMemberForm";
import { InvitationPendingIndicator } from "~frontend/ui/MembersManager/InvitationPendingIndicator";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { trackEvent } from "~frontend/analytics/tracking";
import { assertDefined } from "~shared/assert";

export const CurrentTeamMembersManager = () => {
  const [team] = useCurrentTeamDetails();
  const validatedTeam = assertDefined(team, "Was not able to fetch current team");

  const teamMembers = validatedTeam.memberships.map((membership) => membership.user) ?? [];
  const teamMembersEmails = new Set(teamMembers.map(({ email }) => email));

  function handleRemoveTeamMember(userId: string) {
    removeTeamMember({ userId, teamId: validatedTeam.id });
    trackEvent("Account Removed User", { teamId: validatedTeam.id, userId });
  }

  const invitations = validatedTeam.invitations ?? [];
  const pendingInvitations = invitations.filter(({ email }) => !teamMembersEmails.has(email));

  function handleRemoveInvitation(invitationId: string) {
    removeTeamInvitation({ id: invitationId });
    trackEvent("Deleted Team Invitation", { teamId: validatedTeam.id, invitationId });
  }

  const currentUser = useAssertCurrentUser();
  const isCurrentUserTeamOwner = currentUser.id === validatedTeam.owner_id;

  return (
    <PanelWithTopbarAndCloseButton title={`${validatedTeam.name} members`}>
      <InviteMemberForm />
      {teamMembers.length > 0 && (
        <UISelectGridContainer>
          {teamMembers.map((user) => (
            <UIItemHolder key={user.id}>
              <UserBasicInfo user={user} />
              {!(user.id === validatedTeam.owner_id) && (
                <CircleCloseIconButton
                  isDisabled={!isCurrentUserTeamOwner}
                  onClick={() => handleRemoveTeamMember(user.id)}
                  tooltip={isCurrentUserTeamOwner ? undefined : "Only team owner can delete members"}
                />
              )}
            </UIItemHolder>
          ))}
          {pendingInvitations.map(({ email, id }) => (
            <UIItemHolder key={id}>
              <InvitationPendingIndicator email={email} />
              <CircleCloseIconButton
                isDisabled={!isCurrentUserTeamOwner}
                onClick={() => handleRemoveInvitation(id)}
                tooltip={!isCurrentUserTeamOwner ? "Only team owner can delete invitations" : undefined}
              />
            </UIItemHolder>
          ))}
        </UISelectGridContainer>
      )}
    </PanelWithTopbarAndCloseButton>
  );
};

const UIItemHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;
