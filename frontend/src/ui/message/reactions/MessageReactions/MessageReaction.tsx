import { gql } from "@apollo/client";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { addMessageReaction, removeMessageReaction } from "~frontend/gql/reactions";
import { withFragments } from "~frontend/gql/utils";
import { MessageReaction_MessageFragment, MessageReaction_Message_ReactionFragment } from "~gql";
import { fontSize } from "~ui/baseStyles";
import { Tooltip } from "~ui/popovers/Tooltip";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, SECONDARY_TEXT_COLOR, WHITE } from "~ui/theme/colors/base";

import { MessageReactionTooltip } from "./MessageReactionTooltip";

const fragments = {
  message: gql`
    fragment MessageReaction_message on message {
      id
    }
  `,
  message_reaction: gql`
    ${MessageReactionTooltip.fragments.message_reaction}

    fragment MessageReaction_message_reaction on message_reaction {
      id
      user_id
      ...MessageReactionTooltip_message_reaction
    }
  `,
};

interface Props {
  message: MessageReaction_MessageFragment;
  emoji: string;
  reactions: MessageReaction_Message_ReactionFragment[];
}

export const MessageReaction = withFragments(fragments, ({ message, emoji, reactions }: Props) => {
  const user = useAssertCurrentUser();

  const currentUserReaction = reactions.find((reaction) => reaction.user_id === user.id);

  const isSelectedByCurrentUser = !!currentUserReaction;

  const handleClick = () => {
    if (currentUserReaction) {
      removeMessageReaction({
        id: currentUserReaction.id,
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

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <UIReactionButton ref={buttonRef} onClick={handleClick} isSelected={!!isSelectedByCurrentUser}>
        <p>{emoji}</p>
        <p>{reactions.length}</p>
      </UIReactionButton>
      <Tooltip
        anchorRef={buttonRef}
        placement="bottom"
        label={<MessageReactionTooltip reactions={reactions} emoji={emoji} />}
      />
    </>
  );
});

const UIReactionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  border-radius: 1000px;
  padding: 0 8px;
  cursor: pointer;
  font-size: ${fontSize.label};
  color: ${SECONDARY_TEXT_COLOR};

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
