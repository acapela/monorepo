import React from "react";
import styled from "styled-components";
import { IconCross } from "~ui/icons";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { IconButton } from "~ui/buttons/IconButton";
import { MessageDetailedInfoFragment } from "~gql";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { ITEM_BACKGROUND_WEAK } from "~ui/colors";
import { borderRadius } from "~ui/baseStyles";
import { MetaForMessage } from "~frontend/ui/message/messagesFeed/MetaForMessage";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";

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
        <MetaForMessage user={message.user} date={new Date(message.createdAt)}>
          <UIMessageContent>
            <UIMessageTextHolder>
              <MessageText message={message} />
            </UIMessageTextHolder>
            <MessageMedia nonInteractive message={message} />
          </UIMessageContent>
        </MetaForMessage>
      </UIContent>
      {onRemove && (
        <CornerButtonWrapper>
          <IconButton icon={<IconCross />} onClick={onRemove} />
        </CornerButtonWrapper>
      )}
    </UIHolder>
  );
};

const UIHolder = styled.div`
  display: flex;
  position: relative;
  border-radius: 0 8px 8px 0px;
  background: ${ITEM_BACKGROUND_WEAK};
  cursor: pointer;
`;

const UIBorder = styled.div`
  width: 2px;
  ${borderRadius.circle};
  background-image: linear-gradient(359.7deg, #ee551d -18.05%, #e26e8c 24.03%, #36e3e3 105.82%);
`;

const UIContent = styled.div`
  padding: 20px;
`;

const UIMessageContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const UIMessageTextHolder = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;
