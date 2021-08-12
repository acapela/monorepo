import { ReactNode } from "react";
import styled from "styled-components";

import { namedForwardRef } from "~shared/react/namedForwardRef";
import { borderRadius } from "~ui/baseStyles";
import { disabledCss } from "~ui/disabled";
import { PRIMARY_COLOR, WHITE } from "~ui/theme/colors/base";
import { getButtonColorStyles } from "~ui/transitions";

interface Props {
  icon: ReactNode;
  label?: string;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  tooltipLabel?: string;
}

export const ToolbarButton = namedForwardRef<HTMLButtonElement, Props>(function ToolbarButton(
  { icon, isHighlighted = false, isDisabled = false, onClick, tooltipLabel }: Props,
  ref
) {
  return (
    <UIHolder data-tooltip={tooltipLabel} isActive={isHighlighted} isDisabled={isDisabled} onClick={onClick} ref={ref}>
      {icon}
    </UIHolder>
  );
});

const UIHolder = styled.button<{ isActive: boolean; isDisabled: boolean }>`
  all: unset;
  font-size: 1.5rem;
  height: 1.5em;
  width: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadius.button};

  ${getButtonColorStyles(WHITE)}

  ${(props) => props.isDisabled && disabledCss}
  ${(props) => props.isActive && getButtonColorStyles(PRIMARY_COLOR)}
`;
