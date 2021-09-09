import { gql } from "@apollo/client";
import { EmojiData } from "emoji-mart";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import { useRef } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { MessageEntity } from "~frontend/clientdb/message";
import { addMessageReaction } from "~frontend/gql/reactions";
import { withFragments } from "~frontend/gql/utils";
import { MakeReactionButton_MessageFragment } from "~gql";
import { isBaseEmoji } from "~richEditor/EmojiButton";
import { useBoolean } from "~shared/hooks/useBoolean";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { EmojiPickerWindow } from "~ui/EmojiPicker/EmojiPickerWindow";
import { IconEmotionSmile } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";

const fragments = {
  message: gql`
    fragment MakeReactionButton_message on message {
      id
      message_reactions {
        emoji
        user_id
      }
    }
  `,
};

interface Props {
  message: MessageEntity;
}

export const MakeReactionButton = observer(({ message }: Props) => {
  const user = useAssertCurrentUser();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isPicking, { set: open, unset: close }] = useBoolean(false);

  const handleEmojiSelect = (emoji: EmojiData) => {
    if (!isBaseEmoji(emoji)) {
      console.warn("Custom emojis are not supported");
      return;
    }

    close();

    const hasUserAlreadyReacted = message.message_reactions.some(
      (reaction) => reaction.emoji === emoji.native && reaction.user_id === user.id
    );

    if (hasUserAlreadyReacted) return;

    addMessageReaction({
      input: {
        emoji: emoji.native,
        message_id: message.id,
        user_id: user.id,
      },
    });
    trackEvent("Reacted To Message", { messageId: message.id, reactionEmoji: emoji.native });
  };

  return (
    <>
      <WideIconButton
        ref={buttonRef}
        tooltip="Add reaction"
        kind="secondary"
        onClick={open}
        icon={<IconEmotionSmile />}
      />
      <AnimatePresence>
        {isPicking && (
          <Popover anchorRef={buttonRef} placement="bottom-end">
            <EmojiPickerWindow onCloseRequest={close} onSelect={handleEmojiSelect} />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
});
