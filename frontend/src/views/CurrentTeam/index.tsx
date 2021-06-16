import { useRef } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import { emailInputValidator } from "~shared/validation/inputValidation";
import { useCreateTeamInvitationMutation, useCurrentTeamDetails } from "~frontend/gql/teams";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { Container } from "~ui/layout/Container";
import { ItemTitle } from "~ui/typo";

export function CurrentTeamInfoView() {
  const [team] = useCurrentTeamDetails();

  const [createTeamInvitation] = useCreateTeamInvitationMutation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleInviteMember() {
    const email = await openUIPrompt({
      title: "User email",
      description: "Provide email address of person you want to invite",
      placeholder: "Email address...",
      submitLabel: "Send invitation",
      anchor: {
        ref: buttonRef,
        placement: "top-start",
      },
      validateInput: emailInputValidator,
    });

    if (!email?.trim()) return;

    if (!isEmail(email)) {
      alert("incorrect email");
      return;
    }

    const teamId = team?.id;

    if (!teamId) return;

    await createTeamInvitation({ email, teamId });
  }

  const teamMembers = team?.memberships.map((membership) => membership.user) ?? [];

  return (
    <Container>
      <ItemTitle>Current team is: {team?.name}</ItemTitle>
      <Button ref={buttonRef} onClick={handleInviteMember}>
        Invite team member
      </Button>
      <UIInvitation>
        {team?.invitations.map((invitation) => {
          const didJoin = !!invitation.used_at;
          return (
            <div key={invitation.id}>
              Invited: {invitation.email} {didJoin && "(accepted)"}
            </div>
          );
        })}

        <div>Current team members</div>

        {teamMembers.length > 0 && <AvatarList users={teamMembers} />}
      </UIInvitation>
    </Container>
  );
}

const UIInvitation = styled.div``;
