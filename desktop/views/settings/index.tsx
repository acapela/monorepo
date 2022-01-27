import React from "react";
import styled from "styled-components";

import { connectGoogle, connectNotion, connectSlack } from "@aca/desktop/actions/auth";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { theme } from "@aca/ui/theme";

export const SettingsView = function SettingsView() {
  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        <ActionButton action={connectGoogle} />
        <ActionButton action={connectNotion} />
        <ActionButton action={connectSlack} />

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
