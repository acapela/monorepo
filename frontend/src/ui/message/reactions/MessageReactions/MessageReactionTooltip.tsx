import { Data as EmojiDataset, getEmojiDataFromNative } from "emoji-mart";
import data from "emoji-mart/data/all.json";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { MessageReactionEntity } from "~frontend/clientdb/messageReaction";
import { WHITE } from "~ui/theme/colors/base";

interface Props {
  emoji: string;
  reactions: MessageReactionEntity[];
}

const MAX_VISIBLE_REACTED_USERS = 6;

export const MessageReactionTooltip = observer(({ reactions, emoji }: Props) => {
  const user = useAssertCurrentUser();

  const getTextThatShowsWhoReacted = () => {
    const joiner = reactions.length === 2 ? " and " : ", ";
    const namesOfUsersReacting = reactions
      .slice(0, MAX_VISIBLE_REACTED_USERS)
      .map((reaction) => (reaction.user?.id === user.id ? "You" : reaction.user?.name))
      .join(joiner);

    if (reactions.length > MAX_VISIBLE_REACTED_USERS) {
      return `${namesOfUsersReacting}...`;
    }

    return namesOfUsersReacting;
  };

  const emojiShortName = getEmojiDataFromNative(emoji, "apple", data as never as EmojiDataset).id;

  return (
    <UIContent>
      <UIReacted>{getTextThatShowsWhoReacted()}</UIReacted> reacted with <UIEmojiName>:{emojiShortName}:</UIEmojiName>
    </UIContent>
  );
});

const UIContent = styled.div<{}>`
  color: hsla(0, 0%, 100%, 60%);
  text-align: center;
  word-break: break-word;
`;

const UIReacted = styled.span<{}>`
  color: ${WHITE};
`;

const UIEmojiName = styled.div<{}>`
  word-break: break-all;
`;
