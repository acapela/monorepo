import { MotionProps } from "framer-motion";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDeleteTextMessageMutation, useUpdateTextMessageMutation } from "~frontend/gql/topics";
import { TopicMessageDetailedInfoFragment } from "~gql";
import { EditorContent } from "~richEditor/RichEditor";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { useTopicStore } from "../TopicStore";
import { MessageActions } from "./messageContent/MessageActions";
import { MessageMedia } from "./messageContent/MessageMedia";
import { MessageText } from "./messageContent/types/TextMessageContent";
import { MessageLikeContent } from "./MessageLikeContent";

interface Props extends MotionProps {
  message: TopicMessageDetailedInfoFragment;
  className?: string;
}

export const Message = styled(({ message, className }: Props) => {
  const user = useCurrentUser();
  const [deleteMessage] = useDeleteTextMessageMutation();
  const [updateMessage] = useUpdateTextMessageMutation();
  const [isInEditMode, { set: enableEditMode, unset: disableEditMode }] = useBoolean(false);

  const [, updateTopicState] = useTopicStore();

  const [isActive, setIsActive] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  const isOwnMessage = user?.id === message.user.id;

  useClickAway(holderRef, () => {
    setIsActive(false);
  });

  async function handleRemove() {
    await deleteMessage({ id: message.id });
  }

  async function handleEditContentRequest(newContent: EditorContent) {
    disableEditMode();
    await updateMessage({ id: message.id, content: newContent, isDraft: false });
  }

  async function handleReply() {
    updateTopicState((draft) => (draft.currentlyReplyingToMessageId = message.id));
  }

  const shouldShowTools = useDebouncedValue(isOwnMessage && !isInEditMode, { onDelay: 0, offDelay: 200 });

  return (
    <MessageLikeContent
      className={className}
      tools={
        shouldShowTools && (
          <MessageActions
            isActive={isActive}
            onActiveChange={setIsActive}
            onEditRequest={enableEditMode}
            onRemoveRequest={handleRemove}
            onReplyRequest={handleReply}
          />
        )
      }
      user={message.user}
      date={message.createdAt}
    >
      <UIMessageBody>
        <MessageText
          message={message}
          isInEditMode={isInEditMode}
          onEditRequest={handleEditContentRequest}
          onEditCancelRequest={disableEditMode}
        />
        <MessageMedia message={message} />
      </UIMessageBody>
    </MessageLikeContent>
  );
})``;

const UIMessageBody = styled.div``;
