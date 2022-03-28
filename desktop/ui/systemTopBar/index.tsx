import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { useDoubleClick } from "@aca/shared/hooks/useDoubleClick";
import { theme } from "@aca/ui/theme";

import { SYSTEM_BAR_HEIGHT, TRAFFIC_LIGHTS_NEEDED_SPACE } from "./ui";
import { SystemBarUserMenu } from "./UserMenu";

interface Props {
  isFullWidth?: boolean;
  isUserMenuIncluded?: boolean;
  navigationItems?: ReactNode;
  targetActionItems?: ReactNode;
  titleNode?: ReactNode;
}

export function SystemTopBar({
  navigationItems,
  targetActionItems,
  titleNode,
  isFullWidth = false,
  isUserMenuIncluded = true,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  useDoubleClick(barRef, () => {
    toggleMaximizeRequest();
  });

  return (
    <UIBar ref={barRef} $isFullwidth={isFullWidth}>
      <UIButtons>{navigationItems}</UIButtons>
      <UITitle>{titleNode}</UITitle>
      <UIRightButtons>{targetActionItems}</UIRightButtons>
      <UIUser>{isUserMenuIncluded && <SystemBarUserMenu />}</UIUser>
    </UIBar>
  );
}

const UIBar = styled.div<{ $isFullwidth: boolean }>`
  height: ${SYSTEM_BAR_HEIGHT}px;
  min-height: ${SYSTEM_BAR_HEIGHT}px;
  padding: 0 16px;
  ${theme.colors.layout.background.asBgWithReadableText}

  ${(props) => {
    if (props.$isFullwidth) {
      return css`
        padding-left: ${TRAFFIC_LIGHTS_NEEDED_SPACE}px;
      `;
    }
  }}

  body.fullscreen & {
    padding-left: 16px;
  }

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
  padding: 0 16px;
  ${theme.common.ellipsisText}
`;

const UIUser = styled.div``; // TODO(ui): add active style to show click
