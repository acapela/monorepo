import React from "react";
import styled from "styled-components";

import { loginNotionBridge, notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

export const SettingsView = function SettingsView() {
  const notionToken = notionAuthTokenBridgeValue.use();
  const isNotionAuthorized = !!notionToken;
  return (
    <UIHolder>
      <UIHeader>Settings</UIHeader>
      {!isNotionAuthorized && <Button onClick={() => loginNotionBridge()}>Login to Notion</Button>}
      {isNotionAuthorized && <div>Notion authorized</div>}
      <UIVersionInfo>dev</UIVersionInfo>
    </UIHolder>
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
