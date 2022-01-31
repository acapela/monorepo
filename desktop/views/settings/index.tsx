import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { connectFigma, connectGoogle, connectNotion, connectSlack } from "@aca/desktop/actions/auth";
import { slackAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { authStore } from "@aca/desktop/store/authStore";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { theme } from "@aca/ui/theme";

import { InstallSlackButton } from "./InstallSlackButton";

export const SettingsView = observer(function SettingsView() {
  const isSlackAuthorized = !!slackAuthTokenBridgeValue.get();
  const user = getDb().user.findById(authStore.user.id);
  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>

        <ActionButton action={connectGoogle} />
        <ActionButton action={connectNotion} />
        <ActionButton action={connectFigma} />

        <ActionButton action={connectSlack} />
        {isSlackAuthorized && user && !user.has_slack_installation && <InstallSlackButton />}
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
