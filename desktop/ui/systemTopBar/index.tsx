import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { theme } from "@aca/ui/theme";

import { SYSTEM_BAR_HEIGHT, TRAFFIC_LIGHTS_NEEDED_SPACE } from "./ui";
import { SystemBarUserMenu } from "./UserMenu";

interface Props {
  isFullWidth?: boolean;
  navigationItems?: ReactNode;
  targetActionItems?: ReactNode;
  titleNode?: ReactNode;
}

export function SystemTopBar({ navigationItems, targetActionItems, titleNode, isFullWidth = false }: Props) {
  return (
    <UIBar
      $isFullwidth={isFullWidth}
      onDoubleClick={() => {
        toggleMaximizeRequest();
      }}
    >
      <UIButtons>{navigationItems}</UIButtons>
      <UITitle>{titleNode}</UITitle>
      <UIRightButtons>{targetActionItems}</UIRightButtons>
      <UIUser>
        <SystemBarUserMenu />
      </UIUser>
    </UIBar>
  );
}

const UIBar = styled.div<{ $isFullwidth: boolean }>`
  height: ${SYSTEM_BAR_HEIGHT}px;
  min-height: ${SYSTEM_BAR_HEIGHT}px;
  padding: 0 16px;

  ${(props) =>
    props.$isFullwidth &&
    css`
      body:not(.fullscreen) & {
        padding-left: ${TRAFFIC_LIGHTS_NEEDED_SPACE}px;
      }
    `}

  -webkit-app-region: drag;

  border-bottom: 1px solid ${theme.colors.layout.divider.value};
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UIButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-grow: 1;
`;

const UIRightButtons = styled(UIButtons)`
  justify-content: flex-end;
`;

const UITitle = styled.div`
  flex-grow: 2;
  display: flex;
  justify-content: center;
  ${theme.common.ellipsisText}
`;

const UIUser = styled.div``;
