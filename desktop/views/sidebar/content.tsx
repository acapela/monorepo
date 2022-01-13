import React from "react";
import styled, { css } from "styled-components";

import { Button } from "@aca/ui/buttons/Button";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

interface Props {
  onShowSettings: () => void;
  onShowNotification: (props: Notification) => void;
}

export const SidebarContent = function SidebarContent({ onShowSettings }: Props) {
  return (
    <UIHolder>
      <UIHeader>
        <Button onClick={onShowSettings}>Show Settings</Button>
      </UIHeader>

      <UIRequestFeed>Requests are here</UIRequestFeed>
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const primaryPaddingInSidebar = css`
  padding: 20px;
  ${phone(
    css`
      padding: 15px;
    `
  )}
`;

const UIHeader = styled.div<{}>`
  ${primaryPaddingInSidebar}
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIRequestFeed = styled.div<{}>`
  overflow-y: auto;
  height: 100%;
`;
