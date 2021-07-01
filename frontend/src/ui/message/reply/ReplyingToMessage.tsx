import React from "react";
import styled from "styled-components";
import { MessageLikeContent } from "../messagesFeed/MessageLikeContent";
import { BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~ui/colors";
import { IconCross } from "~ui/icons";
import { MessageText } from "../display/types/TextMessageContent";
import { IconButton } from "~ui/buttons/IconButton";
import { MessageBasicInfoFragment } from "~gql";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";

interface Props {
  message: MessageBasicInfoFragment;
  onRemove?: () => void;
}

export const ReplyingToMessage = ({ message, onRemove }: Props) => {
  return (
    <UIHolder>
      <MessageLikeContent user={message.user} date={new Date(message.createdAt)}>
        <MessageText message={message} />
      </MessageLikeContent>
      {onRemove && (
        <CornerButtonWrapper>
          <IconButton icon={<IconCross />} onClick={onRemove} />
        </CornerButtonWrapper>
      )}
    </UIHolder>
  );
};

const UIHolder = styled.div`
  position: relative;
  padding: 8px;
  border-radius: 0 8px 8px 0px;
  border-left: 2px solid ${NOTIFICATION_COLOR};
  background: ${BACKGROUND_ACCENT_WEAK};
`;
