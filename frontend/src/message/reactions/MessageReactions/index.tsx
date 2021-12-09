import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";

import { groupReactionsByEmoji } from "./groupReactionsByEmoji";
import { MessageReaction } from "./MessageReaction";

export const MessageReactions = observer(function MessageReactions({ message }: { message: MessageEntity }) {
  const reactions = message.reactions.all;
  const reactionsByEmoji = computed(() => groupReactionsByEmoji(reactions)).get();

  const messageReactions = Object.entries(reactionsByEmoji).map(([emoji, reactions]) => (
    <MessageReaction emoji={emoji} reactions={reactions as never} message={message} key={emoji} />
  ));

  if (messageReactions.length < 1) return null;

  return <UIReactions>{messageReactions}</UIReactions>;
});

const UIReactions = styled.div<{}>`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
