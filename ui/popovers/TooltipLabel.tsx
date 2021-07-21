import React, { ReactNode, RefObject } from "react";
import styled from "styled-components";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius, colors, fontSize } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { Popover, PopoverPlacement } from "./Popover";

export interface TooltipLabelProps {
  anchorRef: RefObject<HTMLElement>;
  label: ReactNode;
  isDisabled?: boolean;
  placement?: PopoverPlacement;
}

export const TooltipLabel = styled(({ anchorRef, label, isDisabled, placement = "top" }: TooltipLabelProps) => {
  return (
    <Popover anchorRef={anchorRef} isDisabled={isDisabled} placement={placement}>
      <UITooltip presenceStyles={POP_PRESENCE_STYLES}>{label}</UITooltip>
    </Popover>
  );
})``;

const UITooltip = styled(PresenceAnimator)`
  font-size: ${fontSize.label};
  font-weight: bold;
  background-color: ${colors.tooltip.background};
  color: ${colors.tooltip.color};
  padding: 0.5rem 0.75rem;
  ${borderRadius.item};
  pointer-events: none;
  line-height: 1.5em;
  font-size: 0.875rem;
  max-width: 240px;
  text-align: center;
`;
