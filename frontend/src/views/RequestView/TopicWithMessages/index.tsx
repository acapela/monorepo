import { gql, useMutation } from "@apollo/client";
import { AnimateSharedLayout } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { isTopicClosed } from "~frontend/topics/utils";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { TopicViewCard } from "~frontend/ui/topic/TopicViewCard";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { UpdateLastSeenMessageMutation, UpdateLastSeenMessageMutationVariables } from "~gql";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicHeader } from "./TopicHeader";
import { TopicSummaryMessage } from "./TopicSummary";

// Marks last message as read
function useMarkTopicAsRead(topicId: string, messageIds: string[]) {
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

    const lastMessageId = messageIds[messageIds.length - 1];

    if (!lastMessageId) {
      return;
    }

    updateLastSeenMessage({ variables: { topicId, messageId: lastMessageId } });
  }, [messageIds, topicId, updateLastSeenMessage]);
}

export const TopicWithMessages = observer(({ topic }: { topic: TopicEntity }) => {
  const messages = topic.messages.all;

  // TODO figure out how to only run this for actually really existing messages
  // useMarkTopicAsRead(
  //   topic.id,
  //   messages.map((m) => m.id)
  // );

  const isClosed = isTopicClosed(topic);

  const scrollerRef = useRef<ScrollHandle>();

  const user = useAssertCurrentUser();
  const handleCloseTopic = (topicSummary: string) => {
    topic.update({
      closed_at: new Date().toISOString(),
      closed_by_user_id: user.id,
      closing_summary: topicSummary,
    });
    trackEvent("Closed Topic", { topicId: topic.id });
  };
  const onCloseTopicRequest = isClosed ? undefined : handleCloseTopic;

  return (
    <TopicStoreContext>
      <UITopicViewCard headerNode={topic && <TopicHeader onCloseTopicRequest={onCloseTopicRequest} topic={topic} />}>
        {/* Absolutely placed backdrop will take it's width relative to the width its container */}
        {/* This works as this nested container holds no padding/margin left or right */}

        <>
          <ScrollableMessages ref={scrollerRef as never}>
            <AnimateSharedLayout>
              <MessagesFeed onCloseTopicRequest={onCloseTopicRequest} messages={messages} />

              {topic && isClosed && <TopicSummaryMessage topic={topic} />}
            </AnimateSharedLayout>

            {!messages.length && !isClosed && (
              <UIContentWrapper>Start a request by adding a first message with an @-mention below.</UIContentWrapper>
            )}

            {isClosed && <TopicClosureNote />}
          </ScrollableMessages>

          {!isClosed && (
            <ClientSideOnly>
              <UIMessageComposer>
                <CreateNewMessageEditor
                  topicId={topic.id}
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

const UIMessageComposer = styled.div`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 1rem;
  padding: 24px;
  padding-top: 0px;
`;
