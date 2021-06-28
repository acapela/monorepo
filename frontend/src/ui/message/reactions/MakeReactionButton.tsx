import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { IconEmotionSmile } from "~ui/icons";
import { IconButton } from "~ui/buttons/IconButton";
import { Popover } from "~ui/popovers/Popover";
import { useBoolean } from "~shared/hooks/useBoolean";
import { EmojiPickerWindow } from "~ui/EmojiPicker/EmojiPickerWindow";
import { isBaseEmoji } from "~richEditor/EmojiButton";

export const MakeReactionButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPicking, { set: open, unset: close }] = useBoolean(false);

  return (
    <>
      <IconButton ref={buttonRef} tooltip="Add reaction" onClick={open} icon={<IconEmotionSmile />} />
      <AnimatePresence>
        {isPicking && (
          <Popover anchorRef={buttonRef} placement="bottom-end">
            <EmojiPickerWindow
              onCloseRequest={close}
              onSelect={(emoji) => {
                if (!isBaseEmoji(emoji)) {
                  console.warn("Custom emojis are not supported");
                  return;
                }

                console.log(emoji.native);
                close();
              }}
            />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
};
