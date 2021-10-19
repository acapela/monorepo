import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { theme } from "~ui/theme";

import { NotificationSettings } from "./NotificationSettings";
import { TeamManagerSettingsPanel } from "./TeamManager";

const appVersion = process.env.NEXT_PUBLIC_SENTRY_RELEASE;
const appBuildDate = process.env.NEXT_PUBLIC_BUILD_DATE;

export const SettingsView = observer(function SettingsView() {
  const currentTeam = useAssertCurrentTeam();

  return (
    <>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        <NotificationSettings />
        <TeamManagerSettingsPanel team={currentTeam} />

        {appVersion && (
          <UIVersionInfo>
            Version: {appVersion} ({appBuildDate})
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
