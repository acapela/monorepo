import type { PickerProps } from "emoji-mart";
import { Suspense, useRef } from "react";
import styled from "styled-components";
import { namedLazy } from "~shared/namedLazy";
import { EmojiMartStyles } from "./styles";
import { useClickAway } from "react-use";
import { PresenceAnimator } from "~ui/PresenceAnimator";

// Emoji picker is quite heavy component due to amount of data. Let's make it lazy component.
export const EmojiPickerWindowLazy = namedLazy(() => import("emoji-mart"), "Picker");

EmojiPickerWindowLazy.preload();

interface Props extends PickerProps {
  onCloseRequest?: () => void;
}

export function EmojiPickerWindow({ onCloseRequest, ...pickerProps }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);

  useClickAway(holderRef, () => {
    onCloseRequest?.();
  });

  return (
    <>
      <EmojiMartStyles />
      <Suspense fallback={null}>
        <UIHolder ref={holderRef} presenceStyles={{ opacity: [0, 1], y: [5, 0] }} transition={{ delay: 0.2 }}>
          <EmojiPickerWindowLazy {...pickerProps} />
        </UIHolder>
      </Suspense>
    </>
  );
}

const UIHolder = styled(PresenceAnimator)`
  .emoji-mart {
    font: inherit;
  }

  .emoji-mart-preview {
    display: none;
  }

  .emoji-mart-anchors svg {
    margin: auto;
  }
`;
