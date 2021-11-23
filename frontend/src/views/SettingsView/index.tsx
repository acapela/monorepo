import { observer } from "mobx-react";
import router from "next/router";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { IconButton } from "~ui/buttons/IconButton";
import { IconChevronLeft } from "~ui/icons";
import { theme } from "~ui/theme";

import { NotificationSettings } from "./NotificationSettings";
import { SlackSettings } from "./SlackSettings";
import { TeamManagerSettingsPanel } from "./TeamManager";
import { UserGroupsSettings } from "./UserGroupsSettings";

export const SettingsView = observer(function SettingsView({
  version,
  buildDate,
}: {
  version: string | undefined;
  buildDate: string | undefined;
}) {
  const team = useAssertCurrentTeam();

  return (
    <>
      <UIHolder>
        <UIHeader>
          <IconButton
            icon={<IconChevronLeft />}
            kind="secondary"
            tooltip="Go back"
            onClick={() => {
              router.back();
            }}
          />
          Settings
        </UIHeader>
        <UserGroupsSettings team={team} />
        <NotificationSettings />
        <SlackSettings />
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

  ${theme.spacing.pageSections.asGap}
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle};
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIVersionInfo = styled.div`
  ${theme.typo.label.secondary.center};
`;
