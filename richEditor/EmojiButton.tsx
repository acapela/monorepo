import { useRef } from "react";
import { useBoolean } from "~frontend/src/hooks/useBoolean";
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
      {isPicking && (
        <Popover anchorRef={buttonRef} placement="top">
          <EmojiPickerWindow
            onCloseRequest={close}
            onSelect={(emoji) => {
              const nativeEmoji = Reflect.get(emoji, "native");

              onEmojiSelected(nativeEmoji);
              close();
            }}
          />
        </Popover>
      )}
    </>
  );
}
