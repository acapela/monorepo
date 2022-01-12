import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useRef } from "react";

import { useDb } from "@aca/frontend/clientdb";
import { MessageEntity } from "@aca/frontend/clientdb/message";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { EmojiPickerWindow } from "@aca/ui/EmojiPicker/EmojiPickerWindow";
import { IconEmotionSmile } from "@aca/ui/icons";
import { Popover } from "@aca/ui/popovers/Popover";

export const MakeReactionButton = observer(({ message }: { message: MessageEntity }) => {
  const db = useDb();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isPicking, { set: open, unset: close }] = useBoolean(false);

  const handleEmojiSelect = action((emoji: string) => {
    close();

    const hasUserAlreadyReacted = message.reactions.query(
      (reaction) => reaction.emoji === emoji && reaction.isOwn
    ).hasItems;

    if (hasUserAlreadyReacted) return;

    db.messageReaction.create({
      emoji: emoji,
      message_id: message.id,
    });
  });

  return (
    <>
      <IconButton ref={buttonRef} tooltip="Add reaction" onClick={open} icon={<IconEmotionSmile />} />
      <AnimatePresence>
        {isPicking && (
          <Popover anchorRef={buttonRef} placement="bottom-end" enableScreenCover>
            <EmojiPickerWindow onCloseRequest={close} onEmojiPicked={handleEmojiSelect} />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
});
