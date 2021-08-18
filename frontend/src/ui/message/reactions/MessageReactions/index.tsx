import { gql } from "@apollo/client";
import React, { useMemo } from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { MessageReactions_MessageFragment } from "~gql";

import { groupReactionsByEmoji } from "./groupReactionsByEmoji";
import { MessageReaction } from "./MessageReaction";

const fragments = {
  message: gql`
    ${groupReactionsByEmoji.fragments.message_reaction}
    ${MessageReaction.fragments.message}
    ${MessageReaction.fragments.message_reaction}

    fragment MessageReactions_message on message {
      ...MessageReaction_message
      message_reactions {
        emoji
        user_id
        ...GroupReactionsByEmoji_reaction
        ...MessageReaction_message_reaction
      }
    }
  `,
};

interface Props {
  message: MessageReactions_MessageFragment;
}

export const MessageReactions = withFragments(fragments, ({ message }: Props) => {
  const reactionsByEmoji = useMemo(() => groupReactionsByEmoji(message.message_reactions), [message.message_reactions]);

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
