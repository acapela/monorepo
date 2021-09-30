import { MotionProps } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { MessageEntity } from "~frontend/clientdb/message";
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
import { DeleteTextMessageMutation, DeleteTextMessageMutationVariables, Message_MessageFragment } from "~gql";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { assert } from "~shared/assert";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { select } from "~shared/sharedState";
import { IconCheck, IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

import { MessageLikeContent } from "./MessageLikeContent";
import { MessageTask } from "./tasks/MessageTask";
import { MessageTasks } from "./tasks/MessageTasks";

interface Props extends MotionProps {
  message: Message_MessageFragment;
  isBundledWithPreviousMessage?: boolean;
  onCloseTopicRequest?: (summary: string) => void;
  isReadonly?: boolean;
  className?: string;
}

const _Message = styled<Props>(
  observer(({ message, className, isReadonly, isBundledWithPreviousMessage = false, onCloseTopicRequest }) => {
    const user = useCurrentUser();
    const [deleteMessage] = useMutation<DeleteTextMessageMutation, DeleteTextMessageMutationVariables>(
      gql`
        mutation DeleteTextMessage($id: uuid!) {
          message: delete_message_by_pk(id: $id) {
            id
          }
        }
      `
    );

    const topicContext = useTopicStoreContext();

    const isInEditMode = select(() => topicContext?.editedMessageId === message.id);

    function handleStartEditing() {
      assert(topicContext, "Topic context required");
      topicContext.editedMessageId = message.id;
    }

    function handleStopEditing() {
      if (topicContext?.editedMessageId !== message.id) return;

      topicContext.editedMessageId = null;
    }

    const [isActive, setIsActive] = useState(false);
    const holderRef = useRef<HTMLDivElement>(null);

    const isOwnMessage = message.isOwnMessage;

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
        message.remove();
        trackEvent("Deleted Message", { messageId: message.id });
      }
    }

    const shouldShowTools = useDebouncedValue(!isInEditMode && !isReadonly, { onDelay: 0, offDelay: 200 });

    const getMessageActionsOptions = () => {
      const options: PopoverMenuOption[] = [];

      if (onCloseTopicRequest) {
        options.push({
          label: "Close with message",
          onSelect: () => onCloseTopicRequest(convertMessageContentToPlainText(message.content)),
          icon: <IconCheck />,
        });
      }

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
    const messageActionsOptions = getMessageActionsOptions();

    return (
      <UIHolder id={message.id}>
        <MessageLikeContent
          className={className}
          tools={
            shouldShowTools && (
              <UITools>
                <MakeReactionButton message={message} />
                <ReplyButton messageId={message.id} />
                {messageActionsOptions.length > 0 && (
                  <PopoverMenuTrigger
                    onOpen={() => setIsActive(true)}
                    onClose={() => setIsActive(false)}
                    options={messageActionsOptions}
                  >
                    <OptionsButton tooltip={isActive ? undefined : "Show Options"} />
                  </PopoverMenuTrigger>
                )}
              </UITools>
            )
          }
          user={message.user}
          hasHiddenMetadata={isBundledWithPreviousMessage}
          date={new Date(message.created_at)}
        >
          <UIMessageBody>
            {isInEditMode && (
              <EditMessageEditor message={message} onCancelRequest={handleStopEditing} onSaved={handleStopEditing} />
            )}
            {!isInEditMode && (
              <UIMessageContent>
                {message.replied_to_message && <ReplyingToMessage message={message.replied_to_message} />}
                <MessageText content={message.content} />
                <MessageMedia message={message} />
                <MessageLinksPreviews message={message} />
                <MessageReactions message={message} />
              </UIMessageContent>
            )}

            {message.tasks.length > 0 && <MessageTasks tasks={message.tasks} taskOwnerId={message.user_id} />}
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
  gap: 8px;
`;

const UIMessageBody = styled.div<{}>`
  ${MessageTasks} {
    margin-top: 8px;
  }
`;
