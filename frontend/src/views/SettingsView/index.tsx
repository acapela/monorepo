import { observer } from "mobx-react";
import router from "next/router";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { routes } from "@aca/shared/routes";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconChevronLeft } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { NotificationSettings } from "./NotificationSettings";
import { SlackSettings } from "./SlackSettings";
import { TeamManagerSettingsPanel } from "./TeamManager";
import { TeamSettings } from "./TeamSettings";
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
              router.push(routes.home);
            }}
          />
          Settings
        </UIHeader>
        <UserGroupsSettings team={team} />
        <NotificationSettings />
        <SlackSettings />
        <TeamManagerSettingsPanel team={team} />

        {team.isOwnedByCurrentUser && <TeamSettings />}

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
