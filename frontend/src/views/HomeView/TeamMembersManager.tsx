import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import { useCreateTeamInvitation, useCurrentTeamDetails } from "~frontend/gql/teams";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/button";
import { Container } from "~ui/layout/Container";
import { ItemTitle } from "~ui/typo";

export function TeamMembersManager() {
  const [team] = useCurrentTeamDetails();

  const [createTeamInvitation] = useCreateTeamInvitation();

  async function handleInviteMember() {
    const email = await openUIPrompt({
      title: "User email",
      description: "Provide email address of person you want to invite",
      placeholder: "Email address...",
      submitLabel: "Send invitation",
    });

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

const UIInvitation = styled.div``;
