import React from "react";
import styled from "styled-components";
import { useMessageQuery } from "~frontend/gql/topics";
import { renderMessageContent } from "./messagesFeed/messageContent/types/TextMessageContent";
import { richEditorContentCss } from "~richEditor/Theme";
import { MessageLikeContent } from "./messagesFeed/MessageLikeContent";
import { BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~ui/colors";

interface Props {
  id: string;
}

export const ReplyingToMessage = ({ id }: Props) => {
  const [message] = useMessageQuery({ id });

  if (!message) {
    return null;
  }

  return (
    <UIHolder>
      <MessageLikeContent user={message.user} date={message.createdAt}>
        <UIMessageContent>{renderMessageContent(message)}</UIMessageContent>
      </MessageLikeContent>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  padding: 8px;
  border-radius: 0 8px 8px 0px;
  border-left: 2px solid ${NOTIFICATION_COLOR};
  background: ${BACKGROUND_ACCENT_WEAK};
`;

const UIMessageContent = styled.div`
  ${richEditorContentCss};
`;
