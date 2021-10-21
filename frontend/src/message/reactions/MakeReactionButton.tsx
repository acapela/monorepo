import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import { useRef } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { useBoolean } from "~shared/hooks/useBoolean";
import { IconButton } from "~ui/buttons/IconButton";
import { EmojiPickerWindow } from "~ui/EmojiPicker/EmojiPickerWindow";
import { IconEmotionSmile } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";

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

    trackEvent("Reacted To Message", { messageId: message.id, reactionEmoji: emoji.emoji });
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
