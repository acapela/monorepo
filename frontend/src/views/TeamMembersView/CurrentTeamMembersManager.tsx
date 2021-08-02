import styled from "styled-components";
import { PanelWithTopbarAndCloseButton } from "~frontend/ui/MembersManager/PanelWithTopbarAndCloseButton";
import { removeTeamMember, useCurrentTeamDetails, removeTeamInvitation } from "~frontend/gql/teams";
import { UISelectGridContainer } from "~frontend/ui/MembersManager/UISelectGridContainer";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { InviteMemberForm } from "./InviteMemberForm";
import { InvitationPendingIndicator } from "~frontend/ui/MembersManager/InvitationPendingIndicator";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";

export const CurrentTeamMembersManager = () => {
  const [team] = useCurrentTeamDetails();

  const teamMembers = team?.memberships.map((membership) => membership.user) ?? [];
  const teamMembersEmails = new Set(teamMembers.map(({ email }) => email));

  const handleRemoveTeamMember = (userId: string) => {
    if (!team?.id) return;

    removeTeamMember({ userId, teamId: team.id });
  };

  const invitations = team?.invitations ?? [];
  const pendingInvitations = invitations.filter(({ email }) => !teamMembersEmails.has(email));

  const handleRemoveInvitation = (invitationId: string) => {
    removeTeamInvitation({ id: invitationId });
  };

  const currentUser = useAssertCurrentUser();
  const isCurrentUserTeamOwner = currentUser.id === team?.owner_id;

  return (
    <PanelWithTopbarAndCloseButton title="Team members">
      <InviteMemberForm />
      {teamMembers.length > 0 && (
        <UISelectGridContainer>
          {teamMembers.map((user) => (
            <UIItemHolder key={user.id}>
              <UserBasicInfo user={user} />
              {!(user.id === team?.owner_id) && (
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

const UIItemHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px;
`;
