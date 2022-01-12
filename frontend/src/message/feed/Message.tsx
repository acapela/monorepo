import { MotionProps } from "framer-motion";
import { action } from "mobx";
import React, { useRef, useState } from "react";
import { useClickAway, useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";

import { MessageEntity } from "@aca/frontend/clientdb/message";
import { MessageLinksPreviews } from "@aca/frontend/message/display/MessageLinksPreviews";
import { MessageMedia } from "@aca/frontend/message/display/MessageMedia";
import { MessageText } from "@aca/frontend/message/display/types/TextMessageContent";
import { MakeReactionButton } from "@aca/frontend/message/reactions/MakeReactionButton";
import { MessageReactions } from "@aca/frontend/message/reactions/MessageReactions";
import { ReplyButton } from "@aca/frontend/message/reply/ReplyButton";
import { ReplyingToMessage } from "@aca/frontend/message/reply/ReplyingToMessage";
import { createNewRequestFromExistingMessage } from "@aca/frontend/topics/createRequestFromExistingMessage";
import { useTopicStoreContext } from "@aca/frontend/topics/TopicStore";
import { OptionsButton } from "@aca/frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "@aca/frontend/utils/confirm";
import { DecisionVoting } from "@aca/frontend/views/RequestView/TopicWithMessages/Decision/DecisionVoting";
import { assert } from "@aca/shared/assert";
import { styledObserver } from "@aca/shared/component";
import { useDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";
import { useIsHashActive } from "@aca/shared/hooks/useHashChangeEffect";
import { REQUEST_DECISION } from "@aca/shared/requests";
import { select } from "@aca/shared/sharedState";
import { highlightOnceStyles } from "@aca/ui/highlight";
import { IconComments, IconEdit, IconTrash } from "@aca/ui/icons";
import { PopoverMenuOption } from "@aca/ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "@aca/ui/popovers/PopoverMenuTrigger";
import { theme } from "@aca/ui/theme";

import { EditMessageEditor } from "./EditMessageEditor";
import { MessageLikeContent } from "./MessageLikeContent";
import { MessageTasks } from "./tasks/MessageTasks";

interface Props extends MotionProps {
  message: MessageEntity;

  isBundledWithPreviousMessage?: boolean;
  isRemoveDisabled?: boolean;
  isReadonly?: boolean;
  className?: string;
  contentLayoutId?: string;
}

export const Message = styledObserver<Props>(
  ({
    message,
    className,
    isReadonly,
    isBundledWithPreviousMessage = false,
    contentLayoutId,
    isRemoveDisabled = false,
  }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const topicContext = useTopicStoreContext();

    const isInEditMode = select(() => topicContext?.editedMessageId === message.id);

    const handleStartEditing = action(function handleStartEditing() {
      assert(topicContext, "Topic context required");
      topicContext.editedMessageId = message.id;
    });

    const handleStopEditing = action(function handleStopEditing() {
      if (topicContext?.editedMessageId !== message.id) return;

      topicContext.editedMessageId = null;
    });

    const [isActive, setIsActive] = useState(false);
    const holderRef = useRef<HTMLDivElement>(null);

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
      }
    }

    const shouldShowTools = useDebouncedValue(!isInEditMode && !isReadonly && !message.topic?.isClosed, {
      onDelay: 0,
      offDelay: 200,
    });

    const getMessageActionsOptions = () => {
      const options: PopoverMenuOption[] = [];

      if (message.isOwn && message.type === "TEXT") {
        options.push({ label: "Edit message", onSelect: handleStartEditing, icon: <IconEdit /> });
      }

      if (!message.isTopicMainMessage && message.tasks.hasItems) {
        options.push({
          label: "Convert to new request",
          icon: <IconComments />,
          async onSelect() {
            const newRequest = await createNewRequestFromExistingMessage(message);

            newRequest?.navigateTo();
          },
        });
      }

      if (message.isOwn && !isRemoveDisabled) {
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

    useIsomorphicLayoutEffect(
      action(() => {
        const { topic, isUnread } = message;
        if (!isUnread || !rootRef.current || !topicContext) {
          return;
        }
        const isOldestUnread = !topic?.unreadMessages.query(
          (otherMessage) => new Date(otherMessage.created_at) < new Date(message.created_at)
        ).hasItems;
        if (!isOldestUnread) {
          return;
        }
        topicContext.firstUnreadMessageElement = rootRef.current;
      }),
      []
    );

    const shouldHighlight = useIsHashActive(message.id);

    return (
      <UIHolder id={message.id} ref={rootRef} $shouldHighlight={shouldHighlight}>
        <MessageLikeContent
          anchorLink={`#${message.id}`}
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
                    <OptionsButton data-test-id="message-options" tooltip={isActive ? undefined : "Show Options"} />
                  </PopoverMenuTrigger>
                )}
              </UITools>
            )
          }
          user={message.user}
          showOnlyContent={isBundledWithPreviousMessage}
          date={new Date(message.created_at)}
        >
          <UIMessageBody>
            {isInEditMode && (
              <EditMessageEditor message={message} onCancelRequest={handleStopEditing} onSaved={handleStopEditing} />
            )}
            {!isInEditMode && (
              <UIMessageContent>
                {message.repliedToMessage && <ReplyingToMessage message={message.repliedToMessage} />}
                <MessageText content={message.content} animationLayoutId={contentLayoutId} />
                <MessageMedia message={message} />
                <MessageLinksPreviews message={message} />
                <MessageReactions message={message} />
              </UIMessageContent>
            )}

            {message.tasks.query({ type: REQUEST_DECISION }).hasItems && <DecisionVoting message={message} />}

            {message.tasks.hasItems && <MessageTasks message={message} />}
          </UIMessageBody>
        </MessageLikeContent>
      </UIHolder>
    );
  }
)``;

const UIHolder = styled.div<{ $shouldHighlight: boolean }>`
  ${(props) => props.$shouldHighlight && highlightOnceStyles};
`;

const UITools = styled.div<{}>`
  display: flex;
  ${theme.spacing.actions.asGap};
`;

const UIMessageContent = styled.div<{}>`
  display: grid;
  grid-auto-columns: minmax(0, auto);
  ${theme.spacing.actions.asGap};
`;

const UIMessageBody = styled.div<{}>`
  ${MessageTasks} {
    margin-top: 8px;
  }
`;
