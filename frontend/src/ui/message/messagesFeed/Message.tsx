import { MotionProps } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDeleteTextMessageMutation } from "~frontend/gql/messages";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { EditMessageEditor } from "~frontend/ui/message/composer/EditMessageEditor";
import { MessageLinksPreviews } from "~frontend/ui/message/display/MessageLinksPreviews";
import { MessageMedia } from "~frontend/ui/message/display/MessageMedia";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { MakeReactionButton } from "~frontend/ui/message/reactions/MakeReactionButton";
import { MessageReactions } from "~frontend/ui/message/reactions/MessageReactions";
import { ReplyButton } from "~frontend/ui/message/reply/ReplyButton";
import { ReplyingToMessage } from "~frontend/ui/message/reply/ReplyingToMessage";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { MessageFeedInfoFragment } from "~gql";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { select } from "~shared/sharedState";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

import { MessageLikeContent } from "./MessageLikeContent";
import { MessageTasks } from "./MessageTasks";

interface Props extends MotionProps {
  message: MessageFeedInfoFragment;
  isReadonly?: boolean;
  className?: string;
}

export const Message = styled<Props>(
  observer(({ message, className, isReadonly }) => {
    const user = useCurrentUser();
    const [deleteMessage] = useDeleteTextMessageMutation();

    const topicContext = useTopicStoreContext();

    const isInEditMode = select(() => topicContext.editedMessageId === message.id);

    function handleStartEditing() {
      topicContext.editedMessageId = message.id;
    }

    function handleStopEditing() {
      if (topicContext.editedMessageId !== message.id) return;

      topicContext.editedMessageId = null;
    }

    const [isActive, setIsActive] = useState(false);
    const holderRef = useRef<HTMLDivElement>(null);

    const isOwnMessage = user?.id === message.user.id;

    useClickAway(holderRef, () => {
      setIsActive(false);
    });

    async function handleDeleteWithConfirm() {
      const didConfirm = await openConfirmPrompt({
        title: "Are you sure?",
        description: "This action cannot be undone.",
        confirmLabel: "Delete message",
      });

      if (didConfirm) {
        await deleteMessage({ id: message.id });
        trackEvent("Deleted Message", { messageId: message.id });
      }
    }

    const shouldShowTools = useDebouncedValue(!isInEditMode && !isReadonly, { onDelay: 0, offDelay: 200 });

    const getMessageActionsOptions = () => {
      const options = [];

      if (isOwnMessage) {
        options.push({ label: "Edit message", onSelect: handleStartEditing, icon: <IconEdit /> });
      }

      if (isOwnMessage) {
        options.push({
          label: "Delete message",
          onSelect: handleDeleteWithConfirm,
          isDestructive: true,
          icon: <IconTrash />,
        });
      }

      return options;
    };

    return (
      <UIHolder id={message.id}>
        <MessageLikeContent
          className={className}
          tools={
            shouldShowTools && (
              <UITools>
                <MakeReactionButton message={message} />
                <ReplyButton message={message} />
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

            {message.tasks.length > 0 && <MessageTasks tasksAuthor={message.user} tasks={message.tasks} />}
          </UIMessageBody>
        </MessageLikeContent>
      </UIHolder>
    );
  })
)``;

const UIHolder = styled.div<{}>``;

const UITools = styled.div<{}>`
  display: flex;
  gap: 8px;
`;

const UIMessageContent = styled.div<{}>`
  display: grid;
  grid-auto-columns: minmax(0, auto);
  gap: 16px;
`;

const UIMessageBody = styled.div<{}>`
  ${MessageTasks} {
    margin-top: 24px;
  }
`;
