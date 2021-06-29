import React from "react";
import styled from "styled-components";
import { getEmojiDataFromNative, Data as EmojiDataset } from "emoji-mart";
import data from "emoji-mart/data/all.json";
import { ReactionBasicInfoFragment } from "~gql";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { borderRadius, colors, fontSize } from "~ui/baseStyles";
import { WHITE } from "~ui/colors";

interface Props {
  emoji: string;
  reactions: ReactionBasicInfoFragment[];
}

const MAX_VISIBLE_REACTED_USERS = 6;

export const MessageReactionTooltip = ({ reactions, emoji }: Props) => {
  const user = useAssertCurrentUser();

  const getTextThatShowsWhoReacted = () => {
    const joiner = reactions.length === 2 ? " and " : ", ";
    const namesOfUsersReacting = reactions
      .slice(0, MAX_VISIBLE_REACTED_USERS)
      .map((reaction) => (reaction.user.id === user.id ? "You" : reaction.user.name))
      .join(joiner);

    if (reactions.length > MAX_VISIBLE_REACTED_USERS) {
      return `${namesOfUsersReacting}...`;
    }

    return namesOfUsersReacting;
  };

  const emojiShortName = getEmojiDataFromNative(emoji, "apple", data as never as EmojiDataset).id;

  return (
    <UIHolder>
      <UIContent>
        <UIReacted>{getTextThatShowsWhoReacted()}</UIReacted> reacted with :{emojiShortName}:
      </UIContent>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.tooltip.background};
  max-width: 160px;
  padding: 8px;
  ${borderRadius.label};
  pointer-events: none;
  line-height: 1.2rem;
`;

const UIContent = styled.p`
  font-size: ${fontSize.tooltip};
  color: hsla(0, 0%, 100%, 60%);
  text-align: center;
`;

const UIReacted = styled.span`
  color: ${WHITE};
`;
