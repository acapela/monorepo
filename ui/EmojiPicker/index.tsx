import type { BaseEmoji } from "emoji-mart";
import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { namedLazy } from "~shared/namedLazy";
import { IconEmotionHappy } from "~ui/icons";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { EmojiMartStyles } from "./styles";

// Emoji picker is quite heavy component due to amount of data. Let's make it lazy component.
export const EmojiPickerWindow = namedLazy(() => import("emoji-mart"), "Picker");

interface Props {
  onPicked?: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ onPicked, className }: Props) {
  const [isOpened, setIsOpened] = useState(false);

  const holderRef = useRef<HTMLDivElement>(null);
  useClickAway(holderRef, () => {
    setIsOpened(false);
  });

  useEffect(() => {
    if (!isOpened) return;

    // For performance reasons, we're showing picker on user hover (with 0 opacity), not on click
    // Picker only supports autoFocus prop which is respected on initial render only. Therefore we're
    // falling back to raw dom to focus picker input
    holderRef.current?.querySelector("input")?.focus();
  }, [isOpened]);

  return (
    <UIHolder ref={holderRef} className={className}>
      <UIOpenIcon onClick={() => setIsOpened(!isOpened)} />
      <EmojiMartStyles />
      <AnimatePresence>
        <Suspense fallback={null}>
          {isOpened && (
            <UIPopupHolder presenceStyles={{ y: [0, 10], opacity: [0, 1] }}>
              <EmojiPickerWindow
                native
                emojiTooltip
                autoFocus={isOpened}
                onSelect={(emojiData: BaseEmoji) => {
                  setIsOpened(false);
                  onPicked?.(emojiData.native);
                }}
              />
            </UIPopupHolder>
          )}
        </Suspense>
      </AnimatePresence>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  position: relative;

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

const UIOpenIcon = styled(IconEmotionHappy)`
  font-size: 2rem;
  cursor: pointer;
  border-radius: 100px;
`;

const UIPopupHolder = styled(PresenceAnimator)`
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  will-change: transform, opacity;
  /* Tell browser none of 100s of emojis can impact outside layout to improve rendering performance */
  contain: layout;
`;
