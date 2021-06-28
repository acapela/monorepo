import React from "react";
import styled from "styled-components";
import { MessageDetailedInfoFragment } from "~gql";
import { MessageReaction } from "./MessageReaction";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const MessageReactions = ({ message }: Props) => {
  return (
    <UIReactions>
      {message.message_reactions.map((reaction) => (
        <MessageReaction reaction={reaction} message={message} key={`${reaction.user.id}-${reaction.emoji}`} />
      ))}
    </UIReactions>
  );
};

const UIReactions = styled.div`
  display: flex;
  gap: 4px;
`;
