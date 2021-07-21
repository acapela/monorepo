import { MembersManagerContainer } from "~frontend/ui/MembersManager/MembersManagerContainer";
import { removeTeamMember, useCurrentTeamDetails, removeTeamInvitation } from "~frontend/gql/teams";
import { MembersContainer } from "~frontend/ui/MembersManager/MembersContainer";
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
    <MembersManagerContainer title="Team members">
      <InviteMemberForm />
      {teamMembers.length > 0 && (
        <MembersContainer>
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
        </MembersContainer>
      )}
    </MembersManagerContainer>
  );
};
