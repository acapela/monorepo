import React from "react";
import styled from "styled-components";
import { useMessageQuery } from "~frontend/gql/messages";
import { MessageLikeContent } from "./messagesFeed/MessageLikeContent";
import { BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~ui/colors";
import { IconCross } from "~ui/icons";
import { MessageText } from "./display/types/TextMessageContent";
import { IconButton } from "~frontend/../../ui/buttons/IconButton";

interface Props {
  id: string;
  onRemove?: () => void;
}

export const ReplyingToMessage = ({ id, onRemove }: Props) => {
  const [message] = useMessageQuery({ id });

  if (!message) {
    return null;
  }

  return (
    <UIHolder>
      <MessageLikeContent user={message.user} date={new Date(message.createdAt)}>
        <MessageText message={message} />
      </MessageLikeContent>
      {onRemove && (
        <UIRemoveButtonWrapper>
          <IconButton icon={<IconCross />} onClick={onRemove} />
        </UIRemoveButtonWrapper>
      )}
    </UIHolder>
  );
};

const UIRemoveButtonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const UIHolder = styled.div`
  position: relative;
  padding: 8px;
  border-radius: 0 8px 8px 0px;
  border-left: 2px solid ${NOTIFICATION_COLOR};
  background: ${BACKGROUND_ACCENT_WEAK};
`;
