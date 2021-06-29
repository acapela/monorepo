import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { MessageDetailedInfoFragment, ReactionBasicInfoFragment } from "~gql";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, WHITE } from "~ui/colors";
import { addMessageReaction, removeMessageReaction } from "~frontend/gql/reactions";
import { Popover } from "~ui/popovers/Popover";
import { MessageReactionTooltip } from "./MessageReactionTooltip";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";

interface Props {
  message: MessageDetailedInfoFragment;
  emoji: string;
  reactions: ReactionBasicInfoFragment[];
}

export const MessageReaction = ({ message, emoji, reactions }: Props) => {
  const user = useAssertCurrentUser();

  const isSelected = reactions.some((reaction) => reaction.user.id === user.id);

  const handleClick = () => {
    if (isSelected) {
      removeMessageReaction({
        emoji,
        messageId: message.id,
        userId: user.id,
      });
    } else {
      addMessageReaction({
        input: {
          emoji,
          message_id: message.id,
          user_id: user.id,
        },
      });
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);
  const shouldShowTooltip = useDebouncedValue(isHovered, { onDelay: 0, offDelay: 150 });

  return (
    <>
      <UIReactionButton
        onMouseEnter={setHovered}
        onMouseLeave={unsetHovered}
        ref={buttonRef}
        onClick={handleClick}
        isSelected={isSelected}
      >
        <p>{emoji}</p>
        <p>{reactions.length}</p>
      </UIReactionButton>
      <AnimatePresence>
        {shouldShowTooltip && (
          <Popover distance={10} anchorRef={buttonRef} placement="bottom">
            <MessageReactionTooltip reactions={reactions} emoji={emoji} />
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
};

const UIReactionButton = styled.button<{ isSelected: boolean }>`
  border-radius: 1000px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  cursor: pointer;

  ${(p) =>
    p.isSelected
      ? css`
          background: ${BACKGROUND_ACCENT_WEAK};
        `
      : css`
          background: ${WHITE};
          border: 1px solid ${BACKGROUND_ACCENT};
        `}
`;
