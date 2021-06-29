import React from "react";
import styled from "styled-components";
import { getEmojiDataFromNative, Data as EmojiData } from "emoji-mart";
import data from "emoji-mart/data/all.json";
import { ReactionBasicInfoFragment } from "~gql";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";

interface Props {
  emoji: string;
  reactions: ReactionBasicInfoFragment[];
}

const MAX_VISIBLE_REACTED_PEOPLE = 6;

export const MessageReactionTooltip = ({ reactions, emoji }: Props) => {
  const user = useAssertCurrentUser();

  const getTextThatShowsWhoReacted = () => {
    const names = reactions
      .slice(0, MAX_VISIBLE_REACTED_PEOPLE)
      .map((reaction) => (reaction.user.id === user.id ? "You" : reaction.user.name))
      .join(", ");

    if (reactions.length > MAX_VISIBLE_REACTED_PEOPLE) {
      return `${names}...`;
    }

    return names;
  };

  const emojiShortName = getEmojiDataFromNative(emoji, "apple", data as never as EmojiData).id;

  return (
    <UIHolder>
      {getTextThatShowsWhoReacted()} reacted with: {emojiShortName}
    </UIHolder>
  );
};

const UIHolder = styled.div``;
