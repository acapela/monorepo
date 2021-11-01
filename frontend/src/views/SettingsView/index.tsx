import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { SlackSettings } from "~frontend/views/SettingsView/SlackSettings";
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
  const currentTeam = useAssertCurrentTeam();

  return (
    <>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        <NotificationSettings />
        <SlackSettings />
        <TeamManagerSettingsPanel team={currentTeam} />

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
