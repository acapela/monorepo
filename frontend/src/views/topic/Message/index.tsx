import { format } from "date-fns";
import { AnimatePresence, MotionProps } from "framer-motion";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { Avatar } from "~frontend/ui/users/Avatar";
import { TopicMessageDetailedInfoFragment } from "~frontend/gql";
import { useDeleteTextMessageMutation, useUpdateTextMessageMutation } from "~frontend/gql/topics";
import { useBoolean } from "~shared/hooks/useBoolean";
import { MessageActions } from "~frontend/views/topic/Message/MessageActions";
import { MessageAttachment } from "~frontend/views/topic/Message/MessageAttachment";
import { MessageText } from "~frontend/views/topic/Message/MessageText";
import { MessageTranscription } from "~frontend/views/topic/Message/MessageTranscription";
import { EditorContent } from "~richEditor/RichEditor";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { ATTACHMENT_PREVIEW_HEIGHT_PX } from "./MessageAttachmentDisplayer";
import { SUCCESS_COLOR } from "~ui/colors";
import { PresenceAnimator } from "~ui/PresenceAnimator";

interface Props extends MotionProps {
  message: TopicMessageDetailedInfoFragment;
  isTopicSummary?: boolean;
}

function getUserOrGuestName(message: TopicMessageDetailedInfoFragment): string {
  return message.user.name || "Guest";
}

export const Message = ({ message, isTopicSummary = false }: Props) => {
  const user = useCurrentUser();
  const [deleteMessage] = useDeleteTextMessageMutation();
  const [updateMessage] = useUpdateTextMessageMutation();
  const [isInEditMode, { set: enableEditMode, unset: disableEditMode }] = useBoolean(false);
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
    disableEditMode();
    await updateMessage({ id: message.id, content: newContent, isDraft: false });
  }

  function getShouldShowTools() {
    if (!isOwnMessage) return false;
    if (isInEditMode) return false;
    if (isTopicSummary) return false;

    return isHovered || isActive;
  }

  const shouldShowTools = useDebouncedValue(getShouldShowTools(), { onDelay: 0, offDelay: 200 });

  const attachments = message.message_attachments ?? [];

  return (
    <UIAnimatedMessageWrapper
      ref={holderRef}
      isOwnMessage={isOwnMessage}
      onMouseEnter={setHovered}
      onMouseLeave={unsetHovered}
    >
      <UIMessageAvatar url={message.user.avatar_url ?? ""} name={getUserOrGuestName(message)} />
      <UIMessageBody isSummary={isTopicSummary}>
        <UIMessageHead>
          <UIUserName>{isOwnMessage ? "You" : getUserOrGuestName(message)}</UIUserName>
          {isTopicSummary && <UIClosedMessageLabel>Closed this topic</UIClosedMessageLabel>}
          <UITimestamp>{format(new Date(message.createdAt), "p")}</UITimestamp>
        </UIMessageHead>
        <MessageText
          message={message}
          isInEditMode={isInEditMode}
          onEditRequest={handleEditContentRequest}
          onEditCancelRequest={disableEditMode}
        />
        {attachments.length > 0 && (
          <UIAttachments>
            {attachments.map(({ attachment }) => (
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
          </UIAttachments>
        )}

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
          <UITools presenceStyles={{ opacity: [0, 1] }}>
            <MessageActions
              isActive={isActive}
              onActiveChange={setIsActive}
              onEditRequest={enableEditMode}
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

const UIMessageBody = styled.div<{ isSummary: boolean }>`
  padding: 1rem;
  border-radius: 1rem;
  min-width: 360px;
  max-width: 700px;

  ${({ isSummary }) => (isSummary ? "background-color: hsla(146, 64%, 96%, 1);" : "background-color: #eee;")}
`;

const UIMessageHead = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.5rem;

  white-space: nowrap;
  overflow: hidden;
`;

const UIUserName = styled.span`
  font-weight: 700;
  margin-right: 12px;
`;

const UIClosedMessageLabel = styled.div`
  margin-right: 12px;
  color: ${SUCCESS_COLOR};
  font-weight: 400;
  opacity: 0.8;
`;

const UITimestamp = styled.span`
  font-weight: 400;
  opacity: 0.4;
`;

const UITools = styled(PresenceAnimator)`
  margin-top: 0.25rem;
`;

const UIAttachments = styled.div`
  margin-top: 1rem;
  display: flex;
  height: ${ATTACHMENT_PREVIEW_HEIGHT_PX}px;
`;
