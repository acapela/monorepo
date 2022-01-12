import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { MessageReactionEntity } from "@aca/frontend/clientdb/messageReaction";
import { theme } from "@aca/ui/theme";

interface Props {
  emoji: string;
  reactions: MessageReactionEntity[];
}

const MAX_VISIBLE_REACTED_USERS = 6;

export const MessageReactionTooltip = observer(({ reactions, emoji }: Props) => {
  const getTextThatShowsWhoReacted = () => {
    const joiner = reactions.length === 2 ? " and " : ", ";
    const namesOfUsersReacting = reactions
      .slice(0, MAX_VISIBLE_REACTED_USERS)
      .map((reaction) => (reaction.isOwn ? "You" : reaction.user?.name))
      .join(joiner);

    if (reactions.length > MAX_VISIBLE_REACTED_USERS) {
      return `${namesOfUsersReacting}...`;
    }

    return namesOfUsersReacting;
  };

  return (
    <UIContent>
      <UIReacted>{getTextThatShowsWhoReacted()}</UIReacted> reacted with <UIEmojiName>{emoji}</UIEmojiName>
    </UIContent>
  );
});

const UIContent = styled.div<{}>`
  ${theme.colors.panels.tooltip.asBgWithReadableText};
  text-align: center;
  word-break: break-word;
`;

const UIReacted = styled.span<{}>``;

const UIEmojiName = styled.div<{}>`
  word-break: break-all;
  font-size: 1.5em;
  font-family: initial !important;
`;
