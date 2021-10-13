import React, { ReactNode, RefObject } from "react";
import styled from "styled-components";

import { POP_PRESENCE_STYLES } from "~ui/animations";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { theme } from "~ui/theme";

import { Popover, PopoverPlacement } from "./Popover";

export interface TooltipLabelProps {
  anchorRef: RefObject<HTMLElement>;
  label: ReactNode;
  isDisabled?: boolean;
  placement?: PopoverPlacement;
}

export const TooltipLabel = styled<TooltipLabelProps>(({ anchorRef, label, isDisabled, placement = "top" }) => {
  return (
    <Popover anchorRef={anchorRef} isDisabled={isDisabled} placement={placement}>
      <UITooltip presenceStyles={POP_PRESENCE_STYLES}>{label}</UITooltip>
    </Popover>
  );
})``;

const UITooltip = styled(PresenceAnimator)<{}>`
  ${theme.typo.functional.tooltip};
  font-weight: bold;
  ${theme.colors.panels.tooltip.asBgWithReadableText};
  padding: 0.5rem 0.75rem;
  ${theme.radius.secondaryItem};
  pointer-events: none;
  line-height: 1.5em;
  font-size: 0.875rem;
  max-width: 240px;
  text-align: center;
`;
