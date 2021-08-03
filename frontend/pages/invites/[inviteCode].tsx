import React, { useEffect } from "react";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { routes } from "~frontend/router";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";
import { assert } from "~shared/assert";
import { lookupTeamName } from "~frontend/gql/teams";
import { useRoomInvitationViewQuery } from "~frontend/gql/roomInvitations";

export default function InvitePage() {
  const user = useCurrentUser();
  const { inviteCode } = routes.invitePage.useAssertParams().route;

  assert(inviteCode, "Invite code required");

  useEffect(() => {
    if (user) {
      window.location.pathname = "/";
    }
  }, [user]);

  const [teamInvitationInfo, { loading: teamInvitationInfoLoading }] = lookupTeamName({ token: inviteCode });
  const [roomInvitationInfo, { loading: roomInvitationInfoLoading }] = useRoomInvitationViewQuery({
    token: inviteCode,
  });
  const invitationInfo = teamInvitationInfo || roomInvitationInfo;
  const isInvitationInfoLoading = teamInvitationInfoLoading || roomInvitationInfoLoading;

  const renderContent = () => {
    /* If there is user, show loading indicator. It might be a bit confusing: We show loading because we're waiting
     * to be sure invitation is accepted. It will get accepted automatically and then `useInvitationAcceptedCallback`
     * will redirect user to homepage.
     * It means the flow will be > user logs in > sees loading > is redirected to home page as a member of the team.
     */
    if (isInvitationInfoLoading || user) {
      return "Loading...";
    }

    if (!invitationInfo) {
      return "Invalid invite code!";
    }

    return (
      <UIHolder>
        You have been invited by {invitationInfo.inviter_name} to join the{" "}
        {teamInvitationInfo ? `"${teamInvitationInfo.team_name}" team` : `"${roomInvitationInfo?.room_name}" room`}.
        <div>
          <LoginOptionsView />
        </div>
      </UIHolder>
    );
  };

  return <WindowView>{renderContent()}</WindowView>;
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
`;
