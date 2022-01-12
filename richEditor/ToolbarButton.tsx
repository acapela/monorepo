import { ReactNode } from "react";
import styled from "styled-components";

import { namedForwardRef } from "@aca/shared/react/namedForwardRef";
import { disabledCss } from "@aca/ui/disabled";
import { theme } from "@aca/ui/theme";

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
  ${theme.radius.button};

  ${theme.colors.action.secondary.interactive};

  ${(props) => props.isDisabled && disabledCss}
  ${(props) => props.isActive && theme.colors.action.primary.interactive}
`;
