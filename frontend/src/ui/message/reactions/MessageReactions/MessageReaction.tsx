import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { useDb } from "~frontend/clientdb";
import { MessageReactionEntity } from "~frontend/clientdb/messageReaction";
import { MessageReaction_MessageFragment } from "~gql";
import { fontSize } from "~ui/baseStyles";
import { Tooltip } from "~ui/popovers/Tooltip";
import { BACKGROUND_ACCENT, BACKGROUND_ACCENT_WEAK, SECONDARY_TEXT_COLOR, WHITE } from "~ui/theme/colors/base";

import { MessageReactionTooltip } from "./MessageReactionTooltip";

interface Props {
  message: MessageReaction_MessageFragment;
  emoji: string;
  reactions: MessageReactionEntity[];
}

export const MessageReaction = observer(({ message, emoji, reactions }: Props) => {
  const db = useDb();

  const currentUserReaction = reactions.find((reaction) => reaction.isOwn);

  const isSelectedByCurrentUser = !!currentUserReaction;

  const handleClick = () => {
    if (currentUserReaction) {
      currentUserReaction.remove();
    } else {
      db.messageReaction.create({ emoji, message_id: message.id });
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
