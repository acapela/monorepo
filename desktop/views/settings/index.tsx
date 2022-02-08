import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { connectFigma, connectGoogle, connectLinear, connectNotion } from "@aca/desktop/actions/auth";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { NotionSpaceSelector } from "./NotionSpaceSelector";
import { ShortcutMapping } from "./ShortcutMapping";
import { SlackActions } from "./SlackActions";
import { ThemeSelector } from "./ThemeSelector";

export const SettingsView = observer(function SettingsView() {
  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>
        <ShortcutMapping />
        Google <ActionButton action={connectGoogle} />
        Notion{" "}
        <HStack alignItems="center" gap={10}>
          <ActionButton action={connectNotion} />
          <NotionSpaceSelector />
        </HStack>
        Figma <ActionButton action={connectFigma} />
        Slack <SlackActions />
        Linear <ActionButton action={connectLinear} />
        <ThemeSelector />
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
