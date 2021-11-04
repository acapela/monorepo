import { MotionProps, motion, useAnimation } from "framer-motion";
import { action } from "mobx";
import React, { useRef, useState } from "react";
import { useClickAway, useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { MessageEntity } from "~frontend/clientdb/message";
import { MessageLinksPreviews } from "~frontend/message/display/MessageLinksPreviews";
import { MessageMedia } from "~frontend/message/display/MessageMedia";
import { MessageText } from "~frontend/message/display/types/TextMessageContent";
import { MakeReactionButton } from "~frontend/message/reactions/MakeReactionButton";
import { MessageReactions } from "~frontend/message/reactions/MessageReactions";
import { ReplyButton } from "~frontend/message/reply/ReplyButton";
import { ReplyingToMessage } from "~frontend/message/reply/ReplyingToMessage";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { assert } from "~shared/assert";
import { styledObserver } from "~shared/component";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { select, useAutorun } from "~shared/sharedState";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

import { EditMessageEditor } from "./EditMessageEditor";
import { MessageLikeContent } from "./MessageLikeContent";
import { MessageTasks } from "./tasks/MessageTasks";

interface Props extends MotionProps {
  message: MessageEntity;
  isBundledWithPreviousMessage?: boolean;
  isReadonly?: boolean;
  className?: string;
  contentLayoutId?: string;
}

export const Message = styledObserver<Props>(
  ({ message, className, isReadonly, isBundledWithPreviousMessage = false, contentLayoutId }) => {
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
        trackEvent("Deleted Message", { messageId: message.id });
      }
    }

    const animateControls = useAnimation();

    const shouldShowTools = useDebouncedValue(!isInEditMode && !isReadonly && !message.topic?.isClosed, {
      onDelay: 0,
      offDelay: 200,
    });

    const getMessageActionsOptions = () => {
      const options: PopoverMenuOption[] = [];

      if (message.isOwn && message.type === "TEXT") {
        options.push({ label: "Edit message", onSelect: handleStartEditing, icon: <IconEdit /> });
      }

      if (message.isOwn) {
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
        if (!isUnread || topic?.messages.last?.id === message.id || !topicContext) {
          return;
        }
        const isOldestUnread = !topic?.unreadMessages.query(
          (otherMessage) => new Date(otherMessage.created_at) < new Date(message.created_at)
        ).hasItems;
        if (!isOldestUnread) {
          return;
        }
        topicContext.scrolledMessageId = message.id;
      }),
      []
    );

    useAutorun(() => {
      if (topicContext?.scrolledMessageId == message.id) {
        animateControls.start(
          {
            translateX: [0, 5, 0],
          },
          { delay: 0.5, duration: 0.3 }
        );
      }
    });

    return (
      <UIHolder
        id={message.id}
        animate={animateControls}
        onClick={() => {
          animateControls.start(
            {
              translateX: [0, 5, 0],
            },
            { delay: 0.5, duration: 0.3 }
          );
        }}
      >
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

            {message.tasks.hasItems && <MessageTasks message={message} />}
          </UIMessageBody>
        </MessageLikeContent>
      </UIHolder>
    );
  }
)``;

const UIHolder = styled(motion.div)<{}>``;

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
