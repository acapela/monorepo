import { Suspense, useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { namedLazy } from "~shared/namedLazy";
import { POP_ANIMATION_CONFIG, POP_PRESENCE_STYLES } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { theme } from "~ui/theme";

import type { EmojiPickerProps } from "./EmojiPickerWindowInner";

// Emoji picker is quite heavy component due to amount of data. Let's make it lazy component.
export const EmojiPickerWindowLazy = namedLazy(() => import("./EmojiPickerWindowInner"), "EmojiPickerWindowInner");

EmojiPickerWindowLazy.preload();

interface Props extends EmojiPickerProps {
  onCloseRequest?: () => void;
}

export function EmojiPickerWindow({ onCloseRequest, ...pickerProps }: Props) {
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
        <UIHolder ref={holderRef} presenceStyles={POP_PRESENCE_STYLES} transition={{ ...POP_ANIMATION_CONFIG }}>
          <EmojiPickerWindowLazy {...pickerProps} />
        </UIHolder>
      </Suspense>
    </>
  );
}

const UIHolder = styled(PresenceAnimator)<{}>`
  ${theme.colors.panels.popover.asBgWithReadableText};
  ${theme.box.popover};
  ${theme.radius.panel};
`;
