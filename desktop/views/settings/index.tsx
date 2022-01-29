import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { connectFigma, connectGoogle, connectNotion, connectSlack } from "@aca/desktop/actions/auth";
import { slackAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { authStore } from "@aca/desktop/store/authStore";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { CreateTeamForm } from "./CreateTeamForm";
import { InstallSlackButton } from "./InstallSlackButton";

export const SettingsView = observer(function SettingsView() {
  const db = getDb();
  const { user, team } = authStore;
  const teamMember = db.teamMember.query((teamMember) => teamMember.user_id == user.id).first;

  const isSlackAuthorized = !!slackAuthTokenBridgeValue.get();

  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        {!team && <CreateTeamForm />}

        <ActionButton action={connectGoogle} />
        <ActionButton action={connectNotion} />
        <ActionButton action={connectSlack} />
        <ActionButton action={connectFigma} />

        {isSlackAuthorized && (
          <HStack alignItems="center" gap={10}>
            <div>Slack authorized</div>
            {!teamMember?.teamMemberSlack && (
              <>{team ? <InstallSlackButton teamId={team.id} /> : <div>Create a team to connect Slack</div>}</>
            )}
          </HStack>
        )}
        <UIVersionInfo>v{window.electronBridge.version}</UIVersionInfo>
      </UIHolder>
    </TraySidebarLayout>
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
