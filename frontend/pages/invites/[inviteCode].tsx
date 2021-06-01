import React, { useEffect } from "react";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useTeamInvitationByToken } from "~frontend/gql/teams";
import { routes } from "~frontend/routes";
import { TeamInvitationView } from "~frontend/views/TeamInvitationView";
import { WindowView } from "~frontend/views/WindowView";
import { assert } from "~shared/assert";

export default function InvitePage() {
  const user = useCurrentUser();
  const { inviteCode } = routes.invitePage.useParams();

  assert(inviteCode, "Invite code required");

  useInvitationAcceptedCallback(inviteCode, () => {
    // We use nav with full reload as changing the team updated 'currentTeamId' which is part of json web token data.
    // Having full refresh we're sure it'll be up-to-date
    // TODO: Add some subscription listening to `currentTeamId` changes that will update JWT / reload automatically.
    window.location.pathname = "/";
  });

  return (
    <WindowView>
      {!user && <TeamInvitationView />}
      {user && "Loading..."}
    </WindowView>
  );
}

function useInvitationAcceptedCallback(token: string, callback: () => void) {
  const user = useCurrentUser();

  const [data] = useTeamInvitationByToken.subscription({ tokenId: token });

  const invitation = data?.team_invitation?.[0] ?? null;

  function getIsAccepted() {
    if (!user) return false;
    if (!invitation) return false;

    return invitation.used_by === user.id && invitation.token === token;
  }

  const isSuccessfullyAccepted = getIsAccepted();

  useEffect(() => {
    if (!isSuccessfullyAccepted) {
      return;
    }

    callback();
  }, [isSuccessfullyAccepted, callback]);
}
