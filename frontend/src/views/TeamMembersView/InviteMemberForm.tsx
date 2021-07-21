import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { LightInput } from "~ui/forms/LightInput";
import { AddMemberInlineForm } from "~frontend/ui/MembersManager/AddMemberInlineForm";
import { createTeamIvitation, useCurrentTeamDetails } from "~frontend/gql/teams";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";
import { useMemo } from "react";
import { trackEvent } from "~frontend/analytics/tracking";

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

    trackEvent("Invite Sent");

    setEmail("");
  };

  return (
    <AddMemberInlineForm
      input={<LightInput placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)} />}
      isValid={isEmailAcceptable}
      onSubmit={handleSubmit}
    />
  );
};
