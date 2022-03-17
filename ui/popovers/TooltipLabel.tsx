import { OverlayWindow } from "@aca/desktop/domains/window/OverlayWindow";
import { POP_PRESENCE_STYLES } from "@aca/ui/animations";
import { Shortcut } from "@aca/ui/keyboard/Shortcut";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";
import { zIndexValues } from "@aca/ui/theme/zIndex";
import React, { ReactNode, RefObject } from "react";
import styled from "styled-components";

import { Popover, PopoverPlacement } from "./Popover";

export interface TooltipLabelProps {
  anchorRef: RefObject<HTMLElement>;
  label: ReactNode;
  shortcut?: ShortcutDefinition;
  isDisabled?: boolean;
  placement?: PopoverPlacement;
}

export const TooltipLabel = styled<TooltipLabelProps>(
  ({ anchorRef, label, isDisabled, shortcut, placement = "top" }) => {
    return (
      <OverlayWindow>
        <TooltipFlyer anchorRef={anchorRef} isDisabled={isDisabled} placement={placement}>
          <UITooltip presenceStyles={POP_PRESENCE_STYLES}>
            {label}
            {shortcut && <Shortcut shortcut={shortcut} />}
          </UITooltip>
        </TooltipFlyer>
      </OverlayWindow>
    );
  }
)``;

const TooltipFlyer = styled(Popover)`
  z-index: ${zIndexValues.tooltip};
  pointer-events: none;
`;

const UITooltip = styled(PresenceAnimator)<{}>`
  ${theme.typo.functional.tooltip};
  ${theme.colors.panels.tooltip.asBgWithReadableText};
  ${theme.box.panel.tooltip.padding.radius};
  ${theme.radius.secondaryItem};
  ${theme.spacing.actions.asGap}
  pointer-events: none;
  max-width: 300px;
  display: flex;
  align-items: center;
`;
