import React from "react";
import styled, { css } from "styled-components";
import { getEmojiDataFromNative } from "emoji-mart";
import data from "emoji-mart/data/all.json";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { MessageDetailedInfoFragment, ReactionBasicInfoFragment } from "~gql";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, WHITE } from "~ui/colors";
import { addMessageReaction, removeMessageReaction } from "~frontend/gql/reactions";

interface Props {
  message: MessageDetailedInfoFragment;
  emoji: string;
  reactions: ReactionBasicInfoFragment[];
}

const MAX_VISIBLE_REACTED_PEOPLE = 6;

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

  const getTextThatShowsWhoReacted = () => {
    const names = reactions
      .slice(0, MAX_VISIBLE_REACTED_PEOPLE)
      .map((reaction) => (reaction.user.id === user.id ? "you" : user.name))
      .join(", ");

    if (reactions.length > MAX_VISIBLE_REACTED_PEOPLE) {
      return `${names}...`;
    }

    return names;
  };

  const tooltipText = `${getTextThatShowsWhoReacted()} reacted with: ${
    getEmojiDataFromNative(emoji, "apple", data).name
  }`;

  return (
    <UIReactionButton data-tooltip={tooltipText} onClick={handleClick} isSelected={isSelected}>
      <p>{emoji}</p>
      <p>{reactions.length}</p>
    </UIReactionButton>
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
