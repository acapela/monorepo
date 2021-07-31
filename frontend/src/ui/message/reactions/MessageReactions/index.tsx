import React, { useMemo } from "react";
import styled from "styled-components";
import { MessageDetailedInfoFragment } from "~gql";
import { groupReactionsByEmoji } from "./groupReactionsByEmoji";
import { MessageReaction } from "./MessageReaction";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const MessageReactions = ({ message }: Props) => {
  const reactionsByEmoji = useMemo(() => groupReactionsByEmoji(message.message_reactions), [message.message_reactions]);

  const messageReactions = Object.entries(reactionsByEmoji).map(([emoji, reactions]) => (
    <MessageReaction emoji={emoji} reactions={reactions} message={message} key={emoji} />
  ));

  if (messageReactions.length < 1) return null;

  return <UIReactions>{messageReactions}</UIReactions>;
};

const UIReactions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
