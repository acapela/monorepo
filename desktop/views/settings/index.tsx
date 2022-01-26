import React from "react";
import styled from "styled-components";

import {
  figmaAuthTokenBridgeValue,
  googleAuthTokenBridgeValue,
  loginFigmaBridge,
  loginGoogleBridge,
  loginNotionBridge,
  loginSlackBridge,
  notionAuthTokenBridgeValue,
  slackAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

export const SettingsView = function SettingsView() {
  const isNotionAuthorized = !!notionAuthTokenBridgeValue.use();

  const isFigmaAuthorized = !!figmaAuthTokenBridgeValue.use();
  const isGoogleAuthorized = googleAuthTokenBridgeValue.use();

  const isSlackAuthorized = !!slackAuthTokenBridgeValue.use();
  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        {!isNotionAuthorized && <Button onClick={() => loginNotionBridge()}>Connect Notion</Button>}
        {isNotionAuthorized && <div>Notion authorized</div>}

        {!isFigmaAuthorized && <Button onClick={() => loginFigmaBridge()}>Connect Figma</Button>}
        {isFigmaAuthorized && <div>Figma authorized</div>}

        {!isGoogleAuthorized && <Button onClick={() => loginGoogleBridge()}>Connect Google</Button>}
        {isGoogleAuthorized && <div>Google authorized</div>}

        {!isSlackAuthorized && <Button onClick={() => loginSlackBridge()}>Connect Slack</Button>}
        {isSlackAuthorized && <div>Slack authorized</div>}
        <UIVersionInfo>dev</UIVersionInfo>
      </UIHolder>
    </TraySidebarLayout>
  );
};

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
