import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { MessageMetaDataWrapper } from "~frontend/ui/message/messagesFeed/MessageMetaData";
import { borderRadius } from "~ui/baseStyles";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { ITEM_BACKGROUND_WEAK, PRIMARY_PINK_1, PRIMARY_TEAL_1, SECONDARY_ORANGE_1 } from "~ui/theme/colors/base";

type Props = {
  message: MessageEntity;
  onRemove?: () => void;
};

export const ReplyingToMessage = observer(({ onRemove, message }: Props) => {
  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const messageTextElement = document.getElementById(message!.id);

    messageTextElement?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <UIHolder onClick={handleClick}>
      <UIBorder />
      <UIContent>
        <MessageMetaDataWrapper user={message.user} date={new Date(message.created_at)}>
          <UIMessageContent>
            <UIMessageText content={message.content} />
            <MessageMedia nonInteractive message={message} />
          </UIMessageContent>
        </MessageMetaDataWrapper>
      </UIContent>
      {onRemove && (
        <CornerButtonWrapper>
          <CircleCloseIconButton size="small" onClick={onRemove} />
        </CornerButtonWrapper>
      )}
    </UIHolder>
  );
});

export const ReplyingToMessageById = observer(
  ({ messageId, ...props }: { messageId: string } & Omit<Props, "message">) => {
    const db = useDb();
    const message = db.message.findById(messageId);
    if (!message) {
      return null;
    }
    return <ReplyingToMessage message={message} {...props} />;
  }
);

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
