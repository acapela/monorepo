import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconMenu } from "@aca/ui/icons";
import { HorizontalSpacingContainer } from "@aca/ui/layout";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

import { SidebarContent } from "./content";

interface Props {
  onShowSettings: () => void;
  onShowNotification: (props: Notification) => void;
  children?: ReactNode;
}

export const SidebarLayout = observer(({ children, onShowSettings, onShowNotification }: Props) => {
  return (
    <UIHolder>
      <UISidebar>
        <SidebarContent onShowSettings={onShowSettings} onShowNotification={onShowNotification} />
      </UISidebar>
      <UIMainContent>
        <UIPhoneToggle>
          <IconButton kind="backgroundAccent" icon={<IconMenu />} />
        </UIPhoneToggle>
        <UIMainContentBody>{children}</UIMainContentBody>
      </UIMainContent>
    </UIHolder>
  );
});

const UISidebar = styled.div<{}>`
  height: 100vh;
  max-height: 100vh;
  ${theme.colors.layout.backgroundAccent.asBg};

  box-sizing: border-box;
  flex-shrink: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const UIHolder = styled.div<{}>`
  display: flex;
  min-height: 100vh;

  ${phone(
    css`
      flex-direction: column;
    `
  )}
`;

const UIMainContent = styled.div<{}>`
  flex-grow: 1;
  min-width: 0;
  max-height: 100vh;
  ${theme.colors.layout.background.asBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  transition: 0.2s all;
`;

const UIMainContentBody = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const UIPhoneToggle = styled(HorizontalSpacingContainer)`
  align-self: stretch;
  padding-top: 20px;
  display: none;

  ${phone(
    css`
      display: block;
    `
  )}
`;
