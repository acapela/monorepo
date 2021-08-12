import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { MessageMetaData } from "~frontend/ui/message/messagesFeed/MessageMetaData";
import { ReplyingToMessageQuery, ReplyingToMessageQueryVariables, ReplyingToMessage_MessageFragment } from "~gql";
import { borderRadius } from "~ui/baseStyles";
import { CircleCloseIconButton } from "~ui/buttons/CircleCloseIconButton";
import { CornerButtonWrapper } from "~ui/buttons/CornerButtonWrapper";
import { ITEM_BACKGROUND_WEAK, PRIMARY_PINK_1, PRIMARY_TEAL_1, SECONDARY_ORANGE_1 } from "~ui/theme/colors/base";

const fragments = {
  message: gql`
    ${MessageMetaData.fragments.user}
    ${MessageText.fragments.message}
    ${MessageMedia.fragments.message}

    fragment ReplyingToMessage_message on message {
      id
      created_at
      ...MessageText_message
      ...MessageMedia_message
      user {
        ...MessageMetaData_user
      }
    }
  `,
};

type Props = (
  | { message: ReplyingToMessage_MessageFragment }
  | {
      messageId: string;
    }
) & {
  onRemove?: () => void;
};

export const ReplyingToMessage = withFragments(fragments, ({ onRemove, ...props }: Props) => {
  let message = "message" in props ? props.message : null;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const messageId = "messageId" in props ? props.messageId : message!.id;
  const { data } = useQuery<ReplyingToMessageQuery, ReplyingToMessageQueryVariables>(
    gql`
      ${fragments.message}

      query ReplyingToMessage($messageId: uuid!) {
        message: message_by_pk(id: $messageId) {
          ...ReplyingToMessage_message
        }
      }
    `,
    message ? { skip: true } : { variables: { messageId } }
  );
  if (!message && data && data.message) {
    message = data.message;
  }
  if (!message) {
    return null;
  }
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
        <MessageMetaData user={message.user} date={new Date(message.created_at)}>
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
});

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
