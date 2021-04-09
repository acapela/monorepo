import { Suspense, useEffect, useRef, useState } from "react";
import type { BaseEmoji } from "emoji-mart";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { AnimatePresence, motion, Target, TargetAndTransition } from "framer-motion";
import { namedLazy } from "@acapela/shared/namedLazy";
import { SmilingFace } from "@acapela/ui/icons";
import { EmojiMartStyles } from "./styles";

// Emoji picker is quite heavy component due to amount of data. Let's make it lazy component.
const LazyPicker = namedLazy(() => import("emoji-mart"), "Picker");

interface Props {
  onPicked?: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ onPicked, className }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const holderRef = useRef<HTMLDivElement>(null);
  useClickAway(holderRef, () => {
    setIsOpened(false);
  });

  const exitStyle: Target = { y: 10, opacity: 0 };
  const enterStyle: TargetAndTransition = { scale: 1, opacity: 1, y: 0 };

  useEffect(() => {
    if (!isOpened) return;

    // For performance reasons, we're showing picker on user hover (with 0 opacity), not on click
    // Picker only supports autoFocus prop which is respected on initial render only. Therefore we're
    // falling back to raw dom to focus picker input
    holderRef.current?.querySelector("input")?.focus();
  }, [isOpened]);

  return (
    <UIHolder
      ref={holderRef}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <UIOpenIcon onClick={() => setIsOpened(!isOpened)} />
      <EmojiMartStyles />

      <Suspense fallback={null}>
        <AnimatePresence>
          {(isOpened || isHovered) && (
            <UIPopupHolder
              initial={exitStyle}
              animate={isOpened ? enterStyle : exitStyle}
              exit={exitStyle}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <LazyPicker
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
        </AnimatePresence>
      </Suspense>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  position: relative;

  .emoji-mart {
    font: inherit;
  }

  .emoji-mart-preview {
    display: none;
  }
`;

const UIOpenIcon = styled(SmilingFace)`
  font-size: 2rem;
  cursor: pointer;
  border-radius: 100px;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const UIPopupHolder = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  will-change: transform, opacity;
  /* Tell browser none of 100s of emojis can impact outside layout to improve rendering performance */
  contain: content, layout;
`;
