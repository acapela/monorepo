import { useState } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import { RoundedTextInput } from "~ui/forms/RoundedTextInput";
import { createTeamIvitation, useCurrentTeamDetails } from "~frontend/gql/teams";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { useMemo } from "react";
import { trackEvent } from "~frontend/analytics/tracking";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

export const InviteMemberForm = () => {
  const teamId = useAssertCurrentTeamId();

  const [team] = useCurrentTeamDetails();
  const teamEmails = useMemo(() => {
    const emails = team
      ? [
          ...team.memberships.map((membership) => membership.user.email),
          ...team.invitations.map((invitation) => invitation.email),
        ]
      : [];

    return new Set(emails);
  }, [team]);

  const [email, setEmail] = useState("");

  const isEmailAcceptable = isEmail(email) && !teamEmails.has(email);

  const handleSubmit = () => {
    createTeamIvitation({ email, teamId });
    setEmail("");
    trackEvent("Invite Sent", { inviteEmail: email, teamId });
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
};

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;
