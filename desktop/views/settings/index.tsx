import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { theme } from "@aca/ui/theme";

import { ShortcutMapping } from "./ShortcutMapping";
import { ThemeSelector } from "./ThemeSelector";

export const SettingsView = observer(function SettingsView() {
  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>

        <IntegrationsManager />
        <ThemeSelector />
        <ShortcutMapping />
        <UIVersionInfo>
          v{window.electronBridge.env.version}
          {process.env.STAGE !== "production" ? ` (${process.env.STAGE})` : ""}
        </UIVersionInfo>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const UIHolder = styled.div<{}>`
  padding: 26px 20px;

  display: flex;
  flex-direction: column;
  max-width: 840px;

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
