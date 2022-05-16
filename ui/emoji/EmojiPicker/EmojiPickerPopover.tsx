import React, { RefObject, Suspense, useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { namedLazy } from "@aca/shared/namedLazy";
import { POP_ANIMATION_CONFIG, POP_PRESENCE_STYLES } from "@aca/ui/animations";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { Popover } from "@aca/ui/popovers/Popover";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

import type { EmojiPickerProps } from "./EmojiPickerPanel";

// Emoji picker is quite heavy component due to amount of data. Let's make it lazy component.
export const EmojiPickerWindowLazy = namedLazy(() => import("./EmojiPickerPanel"), "EmojiPickerWindowInner");

EmojiPickerWindowLazy.preload();

interface Props extends EmojiPickerProps {
  onCloseRequest?: () => void;
  anchorRef?: RefObject<HTMLElement>;
}

export function EmojiPickerPopover({ onCloseRequest, anchorRef, ...pickerProps }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);

  useClickAway(holderRef, () => {
    onCloseRequest?.();
  });

  useShortcut("Esc", () => {
    onCloseRequest?.();
  });

  return (
    <>
      <Suspense fallback={null}>
        <Popover anchorRef={anchorRef!} enableScreenCover>
          <UIHolder ref={holderRef} presenceStyles={POP_PRESENCE_STYLES} transition={{ ...POP_ANIMATION_CONFIG }}>
            <EmojiPickerWindowLazy {...pickerProps} />
          </UIHolder>
        </Popover>
      </Suspense>
    </>
  );
}

const UIHolder = styled(PresenceAnimator)<{}>`
  ${theme.colors.panels.popover.asBgWithReadableText};
  ${theme.box.panel.picker.padding.radius};
  ${theme.radius.panel};
`;
