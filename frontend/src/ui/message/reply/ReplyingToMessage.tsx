import React from "react";
import styled from "styled-components";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { MessageDetailedInfoFragment } from "~gql";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { ITEM_BACKGROUND_WEAK, SECONDARY_ORANGE_1, PRIMARY_PINK_1, PRIMARY_TEAL_1 } from "~ui/theme/colors/base";
import { borderRadius } from "~ui/baseStyles";
import { MessageMetaData } from "~frontend/ui/message/messagesFeed/MessageMetaData";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";

interface Props {
  message: MessageDetailedInfoFragment;
  onRemove?: () => void;
}

export const ReplyingToMessage = ({ message, onRemove }: Props) => {
  const handleClick = () => {
    const messageTextElement = document.getElementById(message.id);

    messageTextElement?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <UIHolder onClick={handleClick}>
      <UIBorder />
      <UIContent>
        <MessageMetaData user={message.user} date={new Date(message.createdAt)}>
          <UIMessageContent>
            <UIMessageText message={message} />
            <MessageMedia nonInteractive message={message} />
          </UIMessageContent>
        </MessageMetaData>
      </UIContent>
      {onRemove && (
        <CornerButtonWrapper>
          <CircleCloseIconButton size="small" onClick={onRemove} />
        </CornerButtonWrapper>
      )}
    </UIHolder>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  position: relative;
  border-radius: 0 8px 8px 0px;
  background: ${ITEM_BACKGROUND_WEAK};
  cursor: pointer;
`;

const UIBorder = styled.div<{}>`
  width: 2px;
  ${borderRadius.circle};
  background-image: linear-gradient(
    359.7deg,
    ${SECONDARY_ORANGE_1} -18.05%,
    ${PRIMARY_PINK_1} 24.03%,
    ${PRIMARY_TEAL_1} 105.82%
  );
`;

const UIContent = styled.div<{}>`
  padding: 20px;
`;

const UIMessageContent = styled.div<{}>`
  display: grid;
  grid-auto-columns: minmax(0, auto);
  gap: 16px;
`;

const UIMessageText = styled(MessageText)<{}>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;
