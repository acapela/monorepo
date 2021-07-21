import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { LightInput } from "~ui/forms/LightInput";
import { AddMemberInlineForm } from "~frontend/ui/MembersManager/AddMemberInlineForm";
import { createTeamIvitation } from "~frontend/gql/teams";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";

export const InviteMemberForm = () => {
  const teamId = useAssertCurrentTeamId();

  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    createTeamIvitation({ email, teamId });
  };

  return (
    <AddMemberInlineForm
      input={<LightInput placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)} />}
      isValid={isEmail(email)}
      onSubmit={handleSubmit}
    />
  );
};
