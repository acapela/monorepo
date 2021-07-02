import React from "react";
import styled from "styled-components";
import { MessageLikeContent } from "~frontend/ui/message/messagesFeed/MessageLikeContent";
import { IconCross } from "~ui/icons";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { IconButton } from "~ui/buttons/IconButton";
import { MessageBasicInfoFragment } from "~gql";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { ITEM_BACKGROUND_WEAK } from "~ui/colors";
import { borderRadius } from "~ui/baseStyles";

interface Props {
  message: MessageBasicInfoFragment;
  onRemove?: () => void;
}

export const ReplyingToMessage = ({ message, onRemove }: Props) => {
  return (
    <UIHolder>
      <UIBorder />
      <UIContent>
        <MessageLikeContent user={message.user} date={new Date(message.createdAt)}>
          <MessageText message={message} />
        </MessageLikeContent>
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
`;

const UIBorder = styled.div`
  width: 2px;
  ${borderRadius.circle};
  background-image: linear-gradient(359.7deg, #ee551d -18.05%, #e26e8c 24.03%, #36e3e3 105.82%);
`;

const UIContent = styled.div`
  padding: 20px;
`;
