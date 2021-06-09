import React, { RefObject } from "react";
import styled from "styled-components";
import { POP_ANIMATION_CONFIG, POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius, colors, fontSize } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { Popover } from "./Popover";

interface Props {
  anchorRef: RefObject<HTMLElement>;
  label: string;
  isDisabled?: boolean;
}

export const TooltipLabel = styled(({ anchorRef, label, isDisabled }: Props) => {
  return (
    <Popover anchorRef={anchorRef} isDisabled={isDisabled} placement="top">
      <UITooltip transition={POP_ANIMATION_CONFIG} presenceStyles={POP_PRESENCE_STYLES}>
        {label}
      </UITooltip>
    </Popover>
  );
})``;

const UITooltip = styled(PresenceAnimator)`
  font-size: ${fontSize.label};
  font-weight: bold;
  background-color: ${colors.tooltip.background};
  color: ${colors.tooltip.color};
  padding: 0.5rem 0.75rem;
  border-radius: ${borderRadius.medium};
  pointer-events: none;
`;
