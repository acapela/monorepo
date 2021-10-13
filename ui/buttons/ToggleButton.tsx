import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { theme } from "~ui/theme";

import { buttonKindSpecificStyle, buttonSizeSpecificStyle } from "./sharedStyles";

interface Props {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  tooltip?: string;
}

export const ToggleButton = ({ isActive, onClick, children, icon, tooltip }: Props) => {
  return (
    <UIButton data-tooltip={tooltip} isActive={isActive} onClick={onClick}>
      <UIIconHolder>{icon}</UIIconHolder>
      {children}
    </UIButton>
  );
};

const UIIconHolder = styled.div<{}>``;

const activeButtonStyles = css`
  ${theme.colors.action.secondary.interactive}
`;

const forceIconColorToBeTextColor = css`
  svg {
    ${theme.colors.action.secondary.asColor}
  }
`;

export const UIButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;

  ${buttonSizeSpecificStyle.small}
  ${buttonKindSpecificStyle.secondary}
  ${theme.font.spezia.semibold}
  
  cursor: pointer;

  ${({ isActive }) => (isActive ? activeButtonStyles : forceIconColorToBeTextColor)}

  ${theme.radius.circle}
  ${theme.transitions.hover()}
`;
