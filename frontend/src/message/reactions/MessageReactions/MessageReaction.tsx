import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { MessageEntity } from "@aca/frontend/clientdb/message";
import { MessageReactionEntity } from "@aca/frontend/clientdb/messageReaction";
import { Tooltip } from "@aca/ui/popovers/Tooltip";
import { theme } from "@aca/ui/theme";

import { MessageReactionTooltip } from "./MessageReactionTooltip";

interface Props {
  message: MessageEntity;
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
      <UIReactionButton data-reaction ref={buttonRef} onClick={handleClick} isSelected={!!isSelectedByCurrentUser}>
        <UIEmoji>{emoji}</UIEmoji>
        <span>{reactions.length}</span>
      </UIReactionButton>
      <Tooltip
        anchorRef={buttonRef}
        placement="bottom"
        label={<MessageReactionTooltip reactions={reactions} emoji={emoji} />}
      />
    </>
  );
});

const background = theme.colors.layout.backgroundAccent;

const UIReactionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  ${theme.box.label};
  ${theme.spacing.actions.asGap}
  ${theme.radius.secondaryItem}
  cursor: pointer;
  ${theme.typo.action.regular};
  ${theme.colors.text.secondary.asColor}
  ${background.asBg};

  ${(props) =>
    props.isSelected &&
    css`
      ${background.hover.asBg};
    `}
`;

const UIEmoji = styled.span`
  font-size: 1.25em;
  font-family: initial !important;
`;
