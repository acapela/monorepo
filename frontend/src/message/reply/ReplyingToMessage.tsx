import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { MessageEntity } from "@aca/frontend/clientdb/message";
import { MessageMedia } from "@aca/frontend/message/display/MessageMedia";
import { MessageText } from "@aca/frontend/message/display/types/TextMessageContent";
import { MessageMetaDataWrapper } from "@aca/frontend/message/feed/MessageMetaData";
import { CloseIconButton } from "@aca/ui/buttons/CloseIconButton";
import { CornerButtonWrapper } from "@aca/ui/buttons/CornerButtonWrapper";
import { theme } from "@aca/ui/theme";

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
    <UIHolder onClick={handleClick} data-reply-to={message.id}>
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
          <CloseIconButton onClick={onRemove} />
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
  ${theme.colors.layout.backgroundAccent.asBg};
  cursor: pointer;
`;

const UIBorder = styled.div<{}>`
  width: 2px;
  ${theme.radius.circle};
  /* TODO PR: Restore gradient */
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
