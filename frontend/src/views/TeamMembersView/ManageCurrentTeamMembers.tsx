import { PanelWithTopbarAndCloseButton } from "~frontend/ui/MembersManager/PanelWithTopbarAndCloseButton";
import { removeTeamMember, useCurrentTeamDetails, removeTeamInvitation } from "~frontend/gql/teams";
import { UISelectGridContainer } from "~frontend/ui/MembersManager/UISelectGridContainer";
import { UserItem } from "~frontend/ui/MembersManager/UserItem";
import { UserBasicInfo } from "~frontend/ui/users/UserBasicInfo";
import { InviteMemberForm } from "./InviteMemberForm";
import { InvitationInfo } from "./InvitationInfo";

export const ManageCurrentTeamMembers = () => {
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

  return (
    <PanelWithTopbarAndCloseButton title="Team members">
      <InviteMemberForm />
      {teamMembers.length > 0 && (
        <UISelectGridContainer>
          {teamMembers.map((user) => (
            <UserItem key={user.id} onRemove={() => handleRemoveTeamMember(user.id)}>
              <UserBasicInfo user={user} />
            </UserItem>
          ))}
          {pendingInvitations.map(({ email, id }) => (
            <UserItem key={email} onRemove={() => handleRemoveInvitation(id)}>
              <InvitationInfo email={email} />
            </UserItem>
          ))}
        </UISelectGridContainer>
      )}
    </PanelWithTopbarAndCloseButton>
  );
};
