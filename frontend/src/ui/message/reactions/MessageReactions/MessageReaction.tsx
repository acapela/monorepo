import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { MessageDetailedInfoFragment, ReactionBasicInfoFragment } from "~gql";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, WHITE, SECONDARY_TEXT_COLOR } from "~ui/theme/colors/base";
import { addMessageReaction, removeMessageReaction } from "~frontend/gql/reactions";
import { MessageReactionTooltip } from "./MessageReactionTooltip";
import { fontSize } from "~ui/baseStyles";
import { Tooltip } from "~ui/popovers/Tooltip";

interface Props {
  message: MessageDetailedInfoFragment;
  emoji: string;
  reactions: ReactionBasicInfoFragment[];
}

export const MessageReaction = ({ message, emoji, reactions }: Props) => {
  const user = useAssertCurrentUser();

  const isSelectedByCurrentUser = reactions.some((reaction) => reaction.user.id === user.id);

  const handleClick = () => {
    if (isSelectedByCurrentUser) {
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

  return (
    <>
      <UIReactionButton ref={buttonRef} onClick={handleClick} isSelected={isSelectedByCurrentUser}>
        <p>{emoji}</p>
        <p>{reactions.length}</p>
      </UIReactionButton>
      <Tooltip
        anchorRef={buttonRef}
        placement="bottom"
        label={<MessageReactionTooltip reactions={reactions} emoji={emoji} />}
      />
    </>
  );
};

const UIReactionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  border-radius: 1000px;
  padding: 0 8px;
  cursor: pointer;
  font-size: ${fontSize.label};
  color: ${SECONDARY_TEXT_COLOR};

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
