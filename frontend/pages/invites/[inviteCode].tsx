import React from "react";
import { routes } from "~frontend/../routes";
import { TeamInvitationView } from "~frontend/views/TeamInvitationView";
import { assert } from "~shared/assert";

export default function InvitePage() {
  const { inviteCode } = routes.invitePage.useParams();

  assert(inviteCode, "Invite code required");

  return <TeamInvitationView code={inviteCode} />;
}
