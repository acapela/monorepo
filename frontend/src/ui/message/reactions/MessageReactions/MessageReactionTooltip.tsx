import React from "react";
import styled from "styled-components";
import { getEmojiDataFromNative, Data as EmojiData } from "emoji-mart";
import data from "emoji-mart/data/all.json";
import { ReactionBasicInfoFragment } from "~gql";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { borderRadius, colors } from "~ui/baseStyles";
import { WHITE } from "~ui/colors";

interface Props {
  emoji: string;
  reactions: ReactionBasicInfoFragment[];
}

const MAX_VISIBLE_REACTED_PEOPLE = 6;

export const MessageReactionTooltip = ({ reactions, emoji }: Props) => {
  const user = useAssertCurrentUser();

  const getTextThatShowsWhoReacted = () => {
    const joiner = reactions.length === 2 ? "and" : ", ";
    const names = reactions
      .slice(0, MAX_VISIBLE_REACTED_PEOPLE)
      .map((reaction) => (reaction.user.id === user.id ? "You" : reaction.user.name))
      .join(joiner);

    if (reactions.length > MAX_VISIBLE_REACTED_PEOPLE) {
      return `${names}...`;
    }

    return names;
  };

  const emojiShortName = getEmojiDataFromNative(emoji, "apple", data as never as EmojiData).id;

  return (
    <UIHolder>
      <UIPointer />
      <UIContent>
        <UIReacted>{getTextThatShowsWhoReacted()}</UIReacted> reacted with :{emojiShortName}:
      </UIContent>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.tooltip.background};
  max-width: 124px;
  padding: 8px;
  ${borderRadius.tooltip};
  pointer-events: none;
`;

const POINTER_WIDTH = 12;
const UIPointer = styled.div`
  position: absolute;
  top: -${POINTER_WIDTH / 2}px;
  border-radius: 2px;
  width: ${POINTER_WIDTH}px;
  height: ${POINTER_WIDTH}px;
  background-color: ${colors.tooltip.background};
  transform: rotate(45deg);
`;

const UIContent = styled.p`
  font-size: 12px;
  color: hsla(0, 0%, 100%, 60%);
  text-align: center;
`;

const UIReacted = styled.span`
  color: ${WHITE};
`;
