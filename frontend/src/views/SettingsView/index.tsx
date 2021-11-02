import { gql, useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { SlackSettings } from "~frontend/views/SettingsView/SlackSettings";
import { SlackUserQuery, SlackUserQueryVariables } from "~gql";
import { theme } from "~ui/theme";

import { NotificationSettings } from "./NotificationSettings";
import { TeamManagerSettingsPanel } from "./TeamManager";

export const SettingsView = observer(function SettingsView({
  version,
  buildDate,
}: {
  version: string | undefined;
  buildDate: string | undefined;
}) {
  const team = useAssertCurrentTeam();

  const { data, loading: isLoadingSlackUser } = useQuery<SlackUserQuery, SlackUserQueryVariables>(
    gql`
      query SlackUser($teamId: uuid!) {
        slackUser: slack_user(team_id: $teamId) {
          slackUserId: slack_user_id
          hasAllScopes: has_all_scopes
        }
      }
    `,
    team ? { variables: { teamId: team.id } } : { skip: true }
  );

  return (
    <>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        <NotificationSettings isLoadingSlackUser={isLoadingSlackUser} slackUser={data?.slackUser} />
        <SlackSettings slackUser={data?.slackUser} />
        <TeamManagerSettingsPanel team={team} />

        {version && (
          <UIVersionInfo>
            Version: {version} ({buildDate})
          </UIVersionInfo>
        )}
      </UIHolder>
    </>
  );
});

const UIHolder = styled.div<{}>`
  padding: 26px 20px;

  display: flex;
  flex-direction: column;

  gap: 16px;
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle};
`;

const UIVersionInfo = styled.div`
  ${theme.typo.label.secondary.center};
`;
