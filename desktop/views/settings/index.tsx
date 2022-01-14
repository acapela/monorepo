import React from "react";
import styled from "styled-components";

import { loginToService } from "@aca/desktop/bridge/notificationServices";
import type { NotificationServiceName } from "@aca/desktop/electron/services";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

export const SettingsView = function SettingsView() {
  function login(serviceName: NotificationServiceName) {
    loginToService(serviceName);
  }
  return (
    <UIHolder>
      <UIHeader>Settings</UIHeader>
      <Button onClick={() => login("notion")}>Login to Notion</Button>
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
