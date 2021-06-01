import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import { useCreateTeamInvitation, useCurrentTeamDetails } from "~frontend/gql/teams";
import { Button } from "~ui/button";
import { Container } from "~ui/layout/Container";
import { ItemTitle } from "~ui/typo";

export function TeamMembersManager() {
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
    <Container>
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
          return <div key={member.id}>Member: {member.name}</div>;
        })}
      </UIInvitation>
    </Container>
  );
}

const UIHolder = styled.div``;

const UISearchWrapper = styled.div`
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const UIInvitation = styled.div``;
