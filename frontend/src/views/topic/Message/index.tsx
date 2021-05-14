import { format } from "date-fns";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Avatar } from "~frontend/design/Avatar";
import { TopicMessageDetailedInfoFragment } from "~frontend/gql";
import { useDeleteTextMessageMutation, useUpdateTextMessageMutation } from "~frontend/gql/topics";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { MessageActions } from "~frontend/views/topic/Message/MessageActions";
import { MessageAttachment } from "~frontend/views/topic/Message/MessageAttachment";
import { MessageText } from "~frontend/views/topic/Message/MessageText";
import { MessageTranscription } from "~frontend/views/topic/Message/MessageTranscription";
import { EditorContent } from "~richEditor/RichEditor";

interface Props extends MotionProps {
  message: TopicMessageDetailedInfoFragment;
}

function getUserOrGuestName(message: TopicMessageDetailedInfoFragment): string {
  return message.user.name || "Guest";
}

export const Message = ({ message }: Props) => {
  const user = useCurrentUser();
  const [deleteMessage] = useDeleteTextMessageMutation();
  const [updateMessage] = useUpdateTextMessageMutation();
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);
  const [isActive, setIsActive] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);
  const [selectedMediaTime, setSelectedMediaTime] = useState<number | null>(null);
  const [actualMediaTime, setActualMediaTime] = useState(0);

  const isOwnMessage = user?.id === message.user.id;

  useClickAway(holderRef, () => {
    setIsActive(false);
  });

  async function handleRemove() {
    await deleteMessage({ id: message.id });
  }

  async function handleEditContentRequest(newContent: EditorContent) {
    setIsInEditMode(false);
    await updateMessage({ id: message.id, content: newContent });
  }

  function getShouldShowTools() {
    if (!isOwnMessage) return false;
    if (isInEditMode) return false;

    return isHovered || isActive;
  }

  const shouldShowTools = getShouldShowTools();

  return (
    <UIAnimatedMessageWrapper
      ref={holderRef}
      isOwnMessage={isOwnMessage}
      onMouseEnter={setHovered}
      onMouseLeave={unsetHovered}
    >
      <UIMessageAvatar url={message.user.avatarUrl ?? ""} name={getUserOrGuestName(message)} />
      <UIMessageBody>
        <UIMessageHead>
          <UIUserName>{isOwnMessage ? "You" : getUserOrGuestName(message)}</UIUserName>
          <UITimestamp>{format(new Date(message.createdAt), "p")}</UITimestamp>
        </UIMessageHead>
        <MessageText message={message} isInEditMode={isInEditMode} onEditRequest={handleEditContentRequest} />
        {message.message_attachments?.map(({ attachment }) => (
          <MessageAttachment
            key={attachment.id}
            attachment={attachment}
            selectedMediaTime={selectedMediaTime}
            onMediaTimeUpdate={(time) => {
              setSelectedMediaTime(null);
              setActualMediaTime(time);
            }}
          />
        ))}
        {message.transcription && (
          <MessageTranscription
            transcription={message.transcription}
            actualMediaTime={actualMediaTime}
            onSeek={setSelectedMediaTime}
          />
        )}
      </UIMessageBody>
      <AnimatePresence>
        {/* TODO: For consistent layout, needs to be always present and hidden with `visibility` */}
        {shouldShowTools && (
          <UITools
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MessageActions
              isActive={isActive}
              onActiveChange={setIsActive}
              onEditRequest={() => setIsInEditMode(true)}
              onRemoveRequest={handleRemove}
            />
          </UITools>
        )}
      </AnimatePresence>
    </UIAnimatedMessageWrapper>
  );
};

const UIMessageAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-top: 5px;
  flex-shrink: 0;
`;

const UIAnimatedMessageWrapper = styled.div<{ isOwnMessage: boolean }>`
  width: auto;
  display: inline-flex;
  align-items: flex-start;
  align-self: ${({ isOwnMessage }) => (isOwnMessage ? "flex-end" : "flex-start")};
  flex-direction: ${({ isOwnMessage }) => (isOwnMessage ? "row-reverse" : "row")};

  margin-top: 0.5rem;
  margin-right: ${({ isOwnMessage }) => (isOwnMessage ? "0" : "0.5")}rem;
  margin-left: ${({ isOwnMessage }) => (isOwnMessage ? "0.5" : "0")}rem;

  border-radius: 0.5rem;

  & > *:not(:last-child) {
    ${({ isOwnMessage }) => (isOwnMessage ? "margin-left: 1rem;" : "margin-right: 1rem;")}
  }

  ${UIMessageAvatar} {
    border-color: rgba(243, 244, 246, 1);
  }
`;

const UIMessageBody = styled.div`
  background-color: #eee;
  padding: 1rem;
  border-radius: 1rem;
  min-width: 280px;
  max-width: 80%;
`;

const UIMessageHead = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.5rem;
`;

const UIUserName = styled.span`
  font-weight: 700;
  margin-right: 0.75em;
`;

const UITimestamp = styled.span`
  font-weight: 400;
  opacity: 0.4;
`;

const UITools = styled(motion.div)`
  margin-top: 0.25rem;
`;
