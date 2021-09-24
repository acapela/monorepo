import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { routes } from "~frontend/router";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";
import {
  AcceptInvitationsMutation,
  AcceptInvitationsMutationVariables,
  TeamInvitationInfoQuery,
  TeamInvitationInfoQueryVariables,
} from "~gql";
import { assert } from "~shared/assert";

export default function InvitePage() {
  const user = useCurrentUser();
  const { inviteCode: token } = routes.invitePage.useAssertParams().route;

  assert(token, "Invite code required");

  const { data: teamInvitationInfoData, loading } = useQuery<TeamInvitationInfoQuery, TeamInvitationInfoQueryVariables>(
    gql`
      query TeamInvitationInfo {
        team_invitation_info {
          id
          email
          team_name
          inviter_name
        }
      }
    `,
    {
      // The only way to access team_invitation_info is with that header and no Authorization
      context: { noAuth: true, headers: { "X-Hasura-Team-Invitation-Token": token } },
    }
  );
  const teamInvitationInfo = teamInvitationInfoData?.team_invitation_info[0];

  const [acceptInvitations, { called: didAcceptInvitations }] = useMutation<
    AcceptInvitationsMutation,
    AcceptInvitationsMutationVariables
  >(gql`
    mutation AcceptInvitations($token: uuid!) {
      accept_invitations(token: $token) {
        success
      }
    }
  `);

  useEffect(() => {
    if (!user || didAcceptInvitations) {
      return;
    }
    acceptInvitations({ variables: { token } }).then(() => {
      window.location.pathname = "/";
    });
  }, [acceptInvitations, didAcceptInvitations, token, user]);

  const renderContent = () => {
    /* If there is user, show loading indicator. It might be a bit confusing: We show loading because we're waiting
     * to be sure invitation is accepted. It will get accepted automatically and then we will redirect to the homepage.
     * It means the flow will be > user logs in > sees loading > is redirected to home page as a member of the team.
     */
    if (loading || user) {
      return "Loading...";
    }

    if (!teamInvitationInfo) {
      return "Invalid invite code!";
    }

    return (
      <UIHolder>
        You have been invited by {teamInvitationInfo.inviter_name} to join the "{teamInvitationInfo.team_name}" team.
        <div>
          <LoginOptionsView signupEmail={teamInvitationInfo.email ?? undefined} />
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
