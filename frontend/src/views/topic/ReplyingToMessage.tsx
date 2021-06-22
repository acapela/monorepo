import React from "react";
import styled from "styled-components";
import { useMessageQuery } from "~frontend/gql/topics";
import { renderMessageContent } from "./messagesFeed/messageContent/types/TextMessageContent";
import { richEditorContentCss } from "~richEditor/Theme";
import { MessageLikeContent } from "./messagesFeed/MessageLikeContent";
import { BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR } from "~ui/colors";
import { borderRadius } from "~ui/baseStyles";
import { IconCross } from "~ui/icons";
import { hoverTransition, hoverActionActiveCss } from "~ui/transitions";

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
      <MessageLikeContent user={message.user} date={message.createdAt}>
        <UIMessageContent>{renderMessageContent(message)}</UIMessageContent>
      </MessageLikeContent>
      {onRemove && (
        <UIRemoveButtonWrapper>
          <UIRemoveButton onClick={onRemove}>
            <IconCross />
          </UIRemoveButton>
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

const UIRemoveButton = styled.div`
  padding: 6px;
  background: #ffffff;
  cursor: pointer;
  ${borderRadius.circle}
  ${hoverTransition()}

  &:hover {
    ${hoverActionActiveCss};
  }
`;

const UIHolder = styled.div`
  position: relative;
  padding: 8px;
  border-radius: 0 8px 8px 0px;
  border-left: 2px solid ${NOTIFICATION_COLOR};
  background: ${BACKGROUND_ACCENT_WEAK};
`;

const UIMessageContent = styled.div`
  ${richEditorContentCss};
`;
