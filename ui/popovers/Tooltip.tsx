import { AnimatePresence } from "framer-motion";
import React, { RefObject } from "react";
import { useHoverDirty } from "react-use";
import styled from "styled-components";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { POP_ANIMATION_CONFIG, POP_PRESENCE_STYLES } from "~ui/animations";
import { borderRadius, colors, fontSize } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { Popover } from "./Popover";

interface Props {
  anchorRef: RefObject<HTMLElement>;
  label: string;
  isDisabled?: boolean;
}

export const Tooltip = styled(({ anchorRef, label, isDisabled }: Props) => {
  const isHovered = useHoverDirty(anchorRef);

  const shouldShow = useDebouncedValue(isHovered, { onDelay: 150, offDelay: 0 });

  return (
    <AnimatePresence>
      {shouldShow && (
        <Popover anchorRef={anchorRef} isDisabled={isDisabled} placement="top">
          <UITooltip transition={POP_ANIMATION_CONFIG} presenceStyles={POP_PRESENCE_STYLES}>
            {label}
          </UITooltip>
        </Popover>
      )}
    </AnimatePresence>
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
