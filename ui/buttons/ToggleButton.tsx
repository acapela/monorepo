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

const activeButtonStyles = css<{}>`
  ${theme.colors.actions.secondary.active()}
`;

const forceIconColorToBeTextColor = css<{}>`
  svg {
    color: ${theme.colors.interactive.actions.secondary.regular.text};
  }
`;

export const UIButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;

  ${buttonSizeSpecificStyle.small}
  ${buttonKindSpecificStyle.secondary}
  ${theme.font.spezia.semibold.build}
  
  cursor: pointer;

  ${({ isActive }) => (isActive ? activeButtonStyles : forceIconColorToBeTextColor)}

  ${theme.borderRadius.circle}
  ${theme.transitions.hover()}
`;
