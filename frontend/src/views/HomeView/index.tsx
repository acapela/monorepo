import styled from "styled-components";
import { Button } from "~ui/button";
import { ItemTitle } from "~ui/typo";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useCreateTeamInvitation, useCurrentTeamDetails, useTeamDetails } from "~frontend/gql/teams";
import isEmail from "validator/lib/isEmail";

export function HomeView() {
  const [team] = useCurrentTeamDetails();

  const [createTeamInvitation] = useCreateTeamInvitation();

  async function handleInviteMember() {
    const email = prompt("User email?");

    if (!email?.trim()) return;

    if (!isEmail(email)) {
      alert("incorrect email");
      return;
    }

    const teamId = team?.team?.id;

    if (!teamId) return;

    await createTeamInvitation({ email, teamId });
  }

  return (
    <UIHolder>
      <ItemTitle>Current team is: {team?.team?.name}</ItemTitle>
      <Button onClick={handleInviteMember}>Invite team member</Button>
      <UIInvitation>
        {team?.team?.invitations.map((invitation) => {
          const didJoin = !!invitation.used_at;
          return (
            <div key={invitation.id}>
              Invited: {invitation.email} {didJoin && "(accepted)"}
            </div>
          );
        })}

        {team?.team?.memberships.map((membership) => {
          const member = membership.user;
          return (
            <div key={member.id}>
              Member: {member.name} ({member.id})
            </div>
          );
        })}
      </UIInvitation>
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UIInvitation = styled.div``;
