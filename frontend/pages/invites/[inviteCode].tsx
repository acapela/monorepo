import React, { useEffect } from "react";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useTeamInvitationByToken } from "~frontend/gql/teams";
import { routes } from "~frontend/routes";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
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
      {/* If there is no user - ask to log in */}
      {!user && (
        <UIHolder>
          <>
            You have been invited to join the team.
            <div>
              <LoginOptionsView />
            </div>
          </>
        </UIHolder>
      )}
      {/* If there is user, show loading indicator. It might be a bit confusing: We show loading because we're waiting
       * to be sure invitation is accepted. It will get accepted automatically and then `useInvitationAcceptedCallback`
       * will redirect user to homepage.
       * It means the flow will be > user logs in > sees loading > is redirected to home page as a member of the team.
       */}
      {user && "Loading..."}
    </WindowView>
  );
}

function useInvitationAcceptedCallback(token: string, callback: () => void) {
  const user = useCurrentUser();

  const [data] = useTeamInvitationByToken({ tokenId: token });

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

const UIHolder = styled.div``;
