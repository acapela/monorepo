import { MotionProps } from "framer-motion";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDeleteTextMessageMutation } from "~frontend/gql/messages";
import { MessageDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { MessageActions } from "~frontend/ui/message/display/MessageActions";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { MessageLikeContent } from "./MessageLikeContent";
import { EditMessageEditor } from "../composer/EditMessageEditor";

interface Props extends MotionProps {
  message: MessageDetailedInfoFragment;
  className?: string;
}

export const Message = styled(({ message, className }: Props) => {
  const user = useCurrentUser();
  const [deleteMessage] = useDeleteTextMessageMutation();
  const [isInEditMode, { set: enableEditMode, unset: disableEditMode }] = useBoolean(false);

  const [isActive, setIsActive] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  const isOwnMessage = user?.id === message.user.id;

  useClickAway(holderRef, () => {
    setIsActive(false);
  });

  async function handleRemove() {
    await deleteMessage({ id: message.id });
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
          />
        )
      }
      user={message.user}
      date={new Date(message.createdAt)}
    >
      <UIMessageBody>
        {isInEditMode && (
          <EditMessageEditor message={message} onCancelRequest={disableEditMode} onSaved={disableEditMode} />
        )}
        {!isInEditMode && (
          <>
            <MessageText message={message} />
            <MessageMedia message={message} />
          </>
        )}
      </UIMessageBody>
    </MessageLikeContent>
  );
})``;

const UIMessageBody = styled.div``;
