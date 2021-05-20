import React from "react";
import { routes } from "~frontend/routes";
import { TeamInvitationView } from "~frontend/views/TeamInvitationView";
import { WindowView } from "~frontend/views/WindowView";
import { assert } from "~shared/assert";

export default function InvitePage() {
  const { inviteCode } = routes.invitePage.useParams();

  assert(inviteCode, "Invite code required");

  return (
    <WindowView>
      <TeamInvitationView code={inviteCode} />
    </WindowView>
  );
}
