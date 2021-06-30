import { MotionProps } from "framer-motion";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDeleteTextMessageMutation } from "~frontend/gql/messages";
import { MessageDetailedInfoFragment } from "~gql";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { MessageLikeContent } from "./MessageLikeContent";
import { EditMessageEditor } from "../composer/EditMessageEditor";
import { useTopicStoreSelector } from "~frontend/topics/TopicStore";
import { ReplyingToMessage } from "../ReplyingToMessage";
import { IconEdit, IconReply, IconTrash } from "~ui/icons";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { MessageLinksPreviews } from "~frontend/ui/message/display/MessageLinksPreviews";
import { MakeReactionButton } from "~frontend/ui/message/reactions/MakeReactionButton";
import { MessageReactions } from "~frontend/ui/message/reactions/MessageReactions";

interface Props extends MotionProps {
  message: MessageDetailedInfoFragment;
  isReadonly?: boolean;
  className?: string;
}

export const Message = styled(({ message, className, isReadonly }: Props) => {
  const user = useCurrentUser();
  const [deleteMessage] = useDeleteTextMessageMutation();

  const [isInEditMode, updateTopicStore] = useTopicStoreSelector(
    (topicStore) => topicStore.editedMessageId === message.id
  );

  async function handleMarkAsBeingRepliedTo() {
    updateTopicStore((draft) => (draft.currentlyReplyingToMessage = message));
  }

  function handleStartEditing() {
    updateTopicStore((draft) => (draft.editedMessageId = message.id));
  }

  function handleStopEditing() {
    updateTopicStore((draft) => {
      if (draft.editedMessageId !== message.id) return;

      draft.editedMessageId = null;
    });
  }

  const [isActive, setIsActive] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  const isOwnMessage = user?.id === message.user.id;

  useClickAway(holderRef, () => {
    setIsActive(false);
  });

  async function handleRemoveWithConfirm() {
    const didConfirm = await openConfirmPrompt({
      title: "Are you sure?",
      description: "This action cannot be undone.",
      confirmLabel: "Remove message",
    });

    if (didConfirm) {
      await deleteMessage({ id: message.id });
    }
  }

  const shouldShowTools = useDebouncedValue(!isInEditMode && !isReadonly, { onDelay: 0, offDelay: 200 });

  const getMessageActionsOptions = () => {
    const options = [];

    if (isOwnMessage) {
      options.push({ label: "Edit message", onSelect: handleStartEditing, icon: <IconEdit /> });
    }

    options.push({ label: "Reply", onSelect: handleMarkAsBeingRepliedTo, icon: <IconReply /> });

    if (isOwnMessage) {
      options.push({
        label: "Delete message",
        onSelect: handleRemoveWithConfirm,
        isDestructive: true,
        icon: <IconTrash />,
      });
    }

    return options;
  };

  return (
    <MessageLikeContent
      className={className}
      tools={
        shouldShowTools && (
          <UITools>
            <MakeReactionButton message={message} />
            <PopoverMenuTrigger
              onOpen={() => setIsActive(true)}
              onClose={() => setIsActive(false)}
              options={getMessageActionsOptions()}
            >
              <OptionsButton tooltip={isActive ? undefined : "Show Options"} />
            </PopoverMenuTrigger>
          </UITools>
        )
      }
      user={message.user}
      date={new Date(message.createdAt)}
    >
      <UIMessageBody>
        {isInEditMode && (
          <EditMessageEditor message={message} onCancelRequest={handleStopEditing} onSaved={handleStopEditing} />
        )}
        {!isInEditMode && (
          <UIMessageContent>
            {message.replied_to_message && <ReplyingToMessage message={message.replied_to_message} />}
            <MessageText message={message} />
            <MessageMedia message={message} />
            <MessageLinksPreviews message={message} />
            <MessageReactions message={message} />
          </UIMessageContent>
        )}
      </UIMessageBody>
    </MessageLikeContent>
  );
})``;

const UITools = styled.div`
  display: flex;
  gap: 8px;
`;

const UIMessageContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const UIMessageBody = styled.div``;
