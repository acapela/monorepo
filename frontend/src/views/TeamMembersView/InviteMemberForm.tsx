import { observer } from "mobx-react";
import { useState } from "react";
import { useMemo } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { Button } from "~ui/buttons/Button";
import { RoundedTextInput } from "~ui/forms/RoundedTextInput";
import { IconPlusSquare } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";

export const InviteMemberForm = observer(() => {
  const teamId = useAssertCurrentTeamId();

  const db = useDb();
  const team = db.team.findById(teamId);

  const teamEmails = useMemo(() => {
    const emails = team
      ? [
          ...team.members.all.map((members) => members.user.email),
          ...team.invitations.all.map((invitation) => invitation.email),
        ]
      : [];

    return new Set(emails);
  }, [team]);

  const [email, setEmail] = useState("");

  const isEmailAcceptable = isEmail(email) && !teamEmails.has(email);

  const handleSubmit = () => {
    db.teamInvitation.create({ email, team_id: teamId });
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
});

const UIHolder = styled.div<{}>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;
