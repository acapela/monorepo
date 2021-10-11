import { gql, useMutation } from "@apollo/client";
import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentTeam } from "~frontend/team/useCurrentTeamId";
import { CreateTeamInvitationMutation, CreateTeamInvitationMutationVariables } from "~gql";
import { Button } from "~ui/buttons/Button";
import { RoundedTextInput } from "~ui/forms/RoundedTextInput";
import { IconPlusSquare } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

export const InviteMemberForm = observer(() => {
  const team = useAssertCurrentTeam();

  const [createTeamInvitation] = useMutation<CreateTeamInvitationMutation, CreateTeamInvitationMutationVariables>(gql`
    mutation CreateTeamInvitation($input: team_invitation_insert_input!) {
      insert_team_invitation_one(object: $input) {
        id
      }
    }
  `);

  const teamEmails = useMemo(
    () =>
      new Set([
        ...team.members.all.map((members) => members.user.email),
        ...team.invitations.all.map((invitation) => invitation.email),
      ]),
    [team]
  );

  const [email, setEmail] = useState("");

  const isEmailAcceptable = isEmail(email) && !teamEmails.has(email);

  const handleSubmit = () => {
    createTeamInvitation({ variables: { input: { email, team_id: team.id } } });
    setEmail("");
    trackEvent("Invite Sent", { inviteEmail: email, teamId: team.id });
  };

  useShortcut("Enter", handleSubmit, { isEnabled: isEmailAcceptable });

  return (
    <UIHolder>
      <RoundedTextInput placeholder="Enter email" value={email} onChangeText={setEmail} />
      <Button iconPosition="start" icon={<IconPlusSquare />} onClick={handleSubmit} isDisabled={!isEmailAcceptable}>
        Add Member
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;
