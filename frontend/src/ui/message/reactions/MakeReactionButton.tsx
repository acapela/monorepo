import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { EmojiData } from "emoji-mart";
import { IconEmotionSmile } from "~ui/icons";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { Popover } from "~ui/popovers/Popover";
import { useBoolean } from "~shared/hooks/useBoolean";
import { EmojiPickerWindow } from "~ui/EmojiPicker/EmojiPickerWindow";
import { isBaseEmoji } from "~richEditor/EmojiButton";
import { MessageDetailedInfoFragment } from "~gql";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { addMessageReaction } from "~frontend/gql/reactions";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const MakeReactionButton = ({ message }: Props) => {
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
      (reaction) => reaction.emoji === emoji.native && reaction.user.id === user.id
    );

    if (hasUserAlreadyReacted) return;

    addMessageReaction({
      input: {
        emoji: emoji.native,
        message_id: message.id,
        user_id: user.id,
      },
    });
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
};
