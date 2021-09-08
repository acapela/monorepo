import type { BaseEmoji, EmojiData } from "emoji-mart";
import { AnimatePresence } from "framer-motion";
import { useRef } from "react";

import { useBoolean } from "~shared/hooks/useBoolean";
import { EmojiPickerWindow } from "~ui/EmojiPicker/EmojiPickerWindow";
import { IconEmotionSmile } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";

import { ToolbarButton } from "./ToolbarButton";

interface Props {
  onEmojiSelected: (emoji: string) => void;
}

export function EmojiButton({ onEmojiSelected }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPicking, { set: open, unset: close }] = useBoolean(false);

  return (
    <>
      <ToolbarButton ref={buttonRef} tooltipLabel="Add emoji..." onClick={open} icon={<IconEmotionSmile />} />
      <AnimatePresence>
        {isPicking && (
          <Popover anchorRef={buttonRef} placement="top" enableScreenCover>
            <EmojiPickerWindow
              onCloseRequest={close}
              onSelect={(emoji) => {
                if (!isBaseEmoji(emoji)) {
                  console.warn("Custom emojis are not supported");
                  return;
                }

                onEmojiSelected(emoji.native);
                close();
              }}
            />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
}

export function isBaseEmoji(emoji: EmojiData): emoji is BaseEmoji {
  // Let's make sure it is not Custom Emoji (which has imageUrl instead of native emoji)
  return !!(emoji as BaseEmoji).native;
}
