import { gql, useMutation, useSubscription } from "@apollo/client";
import { AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { isTopicClosed } from "~frontend/topics/utils";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import {
  TopicClosureSubscription,
  TopicClosureSubscriptionVariables,
  TopicWithMessages_RoomFragment,
  TopicWithMessages_TopicFragment,
  UpdateLastSeenMessageMutation,
  UpdateLastSeenMessageMutationVariables,
} from "~gql";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { disabledCss } from "~ui/disabled";
import { theme } from "~ui/theme";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicHeader } from "./TopicHeader";
import { TopicSummaryMessage } from "./TopicSummary";
import { useMessagesSubscription } from "./useMessagesSubscription";

const fragments = {
  room: gql`
    ${TopicHeader.fragments.room}

    fragment TopicWithMessages_room on room {
      id
      finished_at
      ...TopicHeader_room
    }
  `,
  topic: gql`
    ${isTopicClosed.fragments.topic}
    ${TopicSummaryMessage.fragments.topic}
    ${TopicHeader.fragments.topic}

    fragment TopicWithMessages_topic on topic {
      id
      ...IsTopicClosed_topic
      ...TopicSummaryMessage_topic
      ...TopicHeader_topic
    }
  `,
};

interface Props {
  room: TopicWithMessages_RoomFragment;
  topic: TopicWithMessages_TopicFragment;
}

// Marks last message as read
function useMarkTopicAsRead(topicId: string, messageIds: Set<string> | null) {
  const [updateLastSeenMessage] = useMutation<
    UpdateLastSeenMessageMutation,
    UpdateLastSeenMessageMutationVariables
  >(gql`
    mutation UpdateLastSeenMessage($topicId: uuid!, $messageId: uuid!) {
      insert_last_seen_message_one(
        object: { topic_id: $topicId, message_id: $messageId }
        on_conflict: { constraint: last_seen_message_pkey, update_columns: [message_id] }
      ) {
        message_id
        seen_at
      }
    }
  `);

  useEffect(() => {
    if (!messageIds) {
      return;
    }

    const lastMessageId = Array.from(messageIds).pop();

    if (!lastMessageId) {
      return;
    }

    updateLastSeenMessage({ variables: { topicId, messageId: lastMessageId } });
  }, [messageIds, topicId, updateLastSeenMessage]);
}

export const TopicWithMessages = withFragments(fragments, ({ room, topic }: Props) => {
  const { messages, existingMessageIds, isLoadingMessages } = useMessagesSubscription(topic.id);

  useSubscription<TopicClosureSubscription, TopicClosureSubscriptionVariables>(
    gql`
      ${TopicSummaryMessage.fragments.topic}
      ${TopicHeader.fragments.topic}

      subscription TopicClosure($topicId: uuid!) {
        topic_by_pk(id: $topicId) {
          ...TopicSummaryMessage_topic
          ...TopicHeader_topic
        }
      }
    `,
    { variables: { topicId: topic.id } }
  );

  const isMember = useIsCurrentUserRoomMember(room);

  useMarkTopicAsRead(topic.id, existingMessageIds);

  const isClosed = isTopicClosed(topic);

  const isComposerDisabled = !isMember || isLoadingMessages;

  const scrollerRef = useRef<ScrollHandle>();

  return (
    <TopicStoreContext>
      <UIHolder>
        {/* Absolutely placed backdrop will take it's width relative to the width its container */}
        {/* This works as this nested container holds no padding/margin left or right */}
        <UIBackdropContainer>
          <UIBackDrop />
          <UIMainContainer>
            {/* We need to render the topic header wrapper or else flex bugs out on page reload */}
            <UITopicHeaderHolder>{topic && <TopicHeader room={room} topic={topic} />}</UITopicHeaderHolder>

            <ScrollableMessages ref={scrollerRef as never}>
              <AnimateSharedLayout>
                <MessagesFeed isReadonly={!isMember} messages={messages} />

                {topic && isClosed && <TopicSummaryMessage topic={topic} />}
              </AnimateSharedLayout>

              {!messages.length && !isClosed && (
                <UIContentWrapper>
                  {isLoadingMessages
                    ? "Loading messages..."
                    : "Start the conversation and add your first message below."}
                </UIContentWrapper>
              )}

              {isClosed && <TopicClosureNote isParentRoomOpen={!room.finished_at} />}
            </ScrollableMessages>

            {!isClosed && (
              <ClientSideOnly>
                <UIMessageComposer isDisabled={isComposerDisabled}>
                  <CreateNewMessageEditor
                    topicId={topic.id}
                    isDisabled={isComposerDisabled}
                    isFirstMessage={messages.length === 0}
                    onMessageSent={() => {
                      scrollerRef.current?.scrollToBottom("auto");
                    }}
                  />
                </UIMessageComposer>
              </ClientSideOnly>
            )}
          </UIMainContainer>
        </UIBackdropContainer>
      </UIHolder>
    </TopicStoreContext>
  );
});

const UIHolder = styled(DropFileContext)<{}>`
  height: 100%;
  padding-right: 24px;
`;

const UIBackdropContainer = styled.div<{}>`
  position: relative;
  padding-top: 24px;

  display: flex;
  flex-direction: column;

  height: 100%;
`;

const UIBackDrop = styled.div<{}>`
  position: absolute;
  top: 16px;

  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;

  height: 60px;
  width: 94%;

  background-color: ${theme.colors.layout.foreground()};
  border: 1px solid ${theme.colors.layout.softLine()};

  ${theme.borderRadius.card};
`;

const UITopicHeaderHolder = styled.div<{}>`
  background: ${theme.colors.layout.foreground()};

  ${theme.borderRadius.card}
  border-bottom-left-radius: 0%;
  border-bottom-right-radius: 0%;
`;

const UIMainContainer = styled.div<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  background: ${theme.colors.layout.foreground((modifiers) => [modifiers.opacity(0.65)])};
  border: 1px solid ${theme.colors.layout.softLine()};
  box-sizing: border-box;

  ${theme.borderRadius.card}
  border-bottom-left-radius: 0%;
  border-bottom-right-radius: 0%;

  ${theme.shadow.largeFrame}

  ${ScrollableMessages} {
    flex: 1 1 100%;
    padding: 16px 24px;
    width: 100%;
    overflow: auto;
  }

  ${TopicClosureNote} {
    margin: 48px auto;
  }
`;

const UIMessageComposer = styled.div<{ isDisabled: boolean }>`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 1rem;
  padding: 24px;
  padding-top: 0px;

  ${(props) => props.isDisabled && disabledCss}
`;
