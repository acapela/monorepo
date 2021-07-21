import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { borderRadius, shadow } from "~ui/baseStyles";
import { BASE_GREY_1, BASE_GREY_4, PRIMARY_PINK_1, WHITE, BASE_GREY_6, BASE_GREY_7 } from "~ui/colors";
import { hoverTransition } from "~ui/transitions";

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

const UIIconHolder = styled.div``;

const inactiveButtonStyles = css`
  background: ${WHITE};
  border-color: ${BASE_GREY_4};
`;

const activeButtonStyles = css`
  background: ${BASE_GREY_7};
  border-color: ${PRIMARY_PINK_1};
  ${UIIconHolder} {
    color: ${PRIMARY_PINK_1};
  }
`;

export const UIButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 10px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${BASE_GREY_1};
  ${shadow.button}
  ${borderRadius.circle}
  border: 1px solid;
  cursor: pointer;

  ${({ isActive }) => (isActive ? activeButtonStyles : inactiveButtonStyles)}

  ${hoverTransition()}
  &:hover {
    background: ${BASE_GREY_6};
  }
  &:active {
    background: ${BASE_GREY_6};
  }
`;
