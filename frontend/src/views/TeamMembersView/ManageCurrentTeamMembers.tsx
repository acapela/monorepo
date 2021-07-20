import { MembersManagerContainer } from "~frontend/ui/MembersManager/MembersManagerContainer";
import { removeTeamMember, useCurrentTeamDetails } from "~frontend/gql/teams";
import { MembersContainer } from "~frontend/ui/MembersManager/MembersContainer";
import { MemberItem } from "~frontend/ui/MembersManager/MemberItem";
import { AddMemberInlineForm } from "~frontend/ui/MembersManager/AddMemberInlineForm";

export const ManageCurrentTeamMembers = () => {
  const [team] = useCurrentTeamDetails();

  const teamMembers = team?.memberships.map((membership) => membership.user) ?? [];

  const handleRemoveTeamMember = (userId: string) => {
    if (!team?.id) return;

    removeTeamMember({ userId, teamId: team.id });
  };

  return (
    <MembersManagerContainer title="Team members">
      <AddMemberInlineForm input={null} isValid={false} onSubmit={console.log} />
      {teamMembers.length > 0 && (
        <MembersContainer>
          {teamMembers.map((user) => (
            <MemberItem key={user.id} user={user} onRemove={() => handleRemoveTeamMember(user.id)} />
          ))}
        </MembersContainer>
      )}
    </MembersManagerContainer>
  );
};
