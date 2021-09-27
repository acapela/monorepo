import { gql, useMutation, useSubscription } from "@apollo/client";
import { AnimateSharedLayout } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { withFragments } from "~frontend/gql/utils";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { isTopicClosed } from "~frontend/topics/utils";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { TopicViewCard } from "~frontend/ui/topic/TopicViewCard";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import {
  TopicClosureSubscription,
  TopicClosureSubscriptionVariables,
  TopicWithMessages_RoomFragment,
  TopicWithMessages_TopicFragment,
  UpdateLastSeenMessageMutation,
  UpdateLastSeenMessageMutationVariables,
} from "~gql";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { disabledCss } from "~ui/disabled";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { useUpdateTopic } from "./shared";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicHeader } from "./TopicHeader";
import { TopicSummaryMessage } from "./TopicSummary";
import { useMessagesWithUpdates } from "./useMessagesWithUpdates";

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
  room?: TopicWithMessages_RoomFragment;
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
  const { messages, existingMessageIds, isLoadingMessages } = useMessagesWithUpdates(topic.id);

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

  useMarkTopicAsRead(topic.id, existingMessageIds);

  const isClosed = isTopicClosed(topic);

  const isComposerDisabled = isLoadingMessages;

  const scrollerRef = useRef<ScrollHandle>();

  const [updateTopic] = useUpdateTopic();
  const user = useAssertCurrentUser();
  const handleCloseTopic = (topicSummary: string) => {
    updateTopic({
      variables: {
        id: topic.id,
        input: {
          closed_at: new Date().toISOString(),
          closed_by_user_id: user.id,
          closing_summary: topicSummary,
        },
      },
    });
    trackEvent("Closed Topic", { topicId: topic.id });
  };
  const onCloseTopicRequest = isClosed || room?.finished_at ? undefined : handleCloseTopic;

  return (
    <TopicStoreContext>
      <UITopicViewCard
        headerNode={topic && <TopicHeader onCloseTopicRequest={onCloseTopicRequest} room={room} topic={topic} />}
      >
        {/* Absolutely placed backdrop will take it's width relative to the width its container */}
        {/* This works as this nested container holds no padding/margin left or right */}

        <>
          <ScrollableMessages ref={scrollerRef as never}>
            <AnimateSharedLayout>
              <MessagesFeed onCloseTopicRequest={onCloseTopicRequest} messages={messages} />

              {topic && isClosed && <TopicSummaryMessage topic={topic} />}
            </AnimateSharedLayout>

            {!messages.length && !isClosed && (
              <UIContentWrapper>
                {isLoadingMessages
                  ? "Loading messages..."
                  : "Start a request by adding a first message with an @-mention below."}
              </UIContentWrapper>
            )}

            {isClosed && <TopicClosureNote isParentRoomOpen={!room?.finished_at} />}
          </ScrollableMessages>

          {!isClosed && (
            <ClientSideOnly>
              <UIMessageComposer isDisabled={isComposerDisabled}>
                <CreateNewMessageEditor
                  topicId={topic.id}
                  isDisabled={isComposerDisabled}
                  requireMention={messages.length === 0}
                  onMessageSent={() => {
                    scrollerRef.current?.scrollToBottom("auto");
                  }}
                />
              </UIMessageComposer>
            </ClientSideOnly>
          )}
        </>
      </UITopicViewCard>
    </TopicStoreContext>
  );
});

const UITopicViewCard = styled(TopicViewCard)`
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
