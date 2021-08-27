import { gql, useSubscription } from "@apollo/client";
import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { Message as MessageType } from "~db";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { updateLastSeenMessage } from "~frontend/gql/topics";
import { waitForAllRunningMutationsToFinish, withFragments } from "~frontend/gql/utils";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { isTopicClosed } from "~frontend/topics/utils";
import { CreateNewMessageEditor } from "~frontend/ui/message/composer/CreateNewMessageEditor";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import {
  TopicClosureSubscription,
  TopicClosureSubscriptionVariables,
  TopicMessagesAscSubscription,
  TopicMessagesAscSubscriptionVariables,
  TopicWithMessages_RoomFragment,
  TopicWithMessages_TopicFragment,
} from "~gql";
import { DropFileContext } from "~richEditor/DropFileContext";
import { useAsyncLayoutEffect } from "~shared/hooks/useAsyncEffect";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { disabledCss } from "~ui/disabled";
import { theme } from "~ui/theme";
import { Modifiers } from "~ui/theme/colors/createColor";

import { ScrollableMessages } from "./ScrollableMessages";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicHeader } from "./TopicHeader";
import { TopicSummaryMessage } from "./TopicSummary";

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
  topic: TopicWithMessages_TopicFragment | null;
}

function useMarkTopicAsRead(topicId: string | null, messages: Pick<MessageType, "id">[]) {
  /**
   * Let's mark last message as read each time we have new messages.
   */
  useAsyncLayoutEffect(async () => {
    if (!messages || !topicId) return;

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) return;

    /**
     * Let's make sure we're never marking message from 'optimistic' response (because it is not in the DB yet so it
     * would result in DB error).
     */
    await waitForAllRunningMutationsToFinish();

    // Component might be unmounted at this point, but we still want to mark seen message as read.

    // There are no mutations in progress now so we can safely mark new message as read as mutation creating it already
    // finished running
    updateLastSeenMessage({ topicId, messageId: lastMessage.id });
  }, [messages]);
}

export const TopicWithMessages = withFragments(fragments, ({ room, topic }: Props) => {
  const { data } = useSubscription<TopicMessagesAscSubscription, TopicMessagesAscSubscriptionVariables>(
    gql`
      ${MessagesFeed.fragments.message}

      subscription TopicMessagesAsc(
        $topicId: uuid!
        $limit: Int
        $order: order_by = asc
        $typeExpression: message_type_enum_comparison_exp = { _is_null: false }
      ) {
        messages: message(
          where: { topic_id: { _eq: $topicId }, is_draft: { _eq: false }, type: $typeExpression }
          order_by: [{ created_at: $order }]
          limit: $limit
        ) {
          ...Message_message
        }
      }
    `,
    topic ? { variables: { topicId: topic.id } } : { skip: true }
  );

  useSubscription<TopicClosureSubscription, TopicClosureSubscriptionVariables>(
    gql`
      ${TopicSummaryMessage.fragments.topic}

      subscription TopicClosure($topicId: uuid!) {
        topic_by_pk(id: $topicId) {
          ...TopicSummaryMessage_topic
        }
      }
    `,
    topic ? { variables: { topicId: topic.id } } : { skip: true }
  );

  const isMember = useIsCurrentUserRoomMember(room);

  useMarkTopicAsRead(topic?.id ?? null, data ? data.messages : []);

  if (!topic) {
    return null;
  }

  const messages = data?.messages ?? [];

  const isClosed = isTopicClosed(topic);

  const isComposerDisabled = !isMember || !data?.messages;

  const isLoadingMessages = !data?.messages;

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

            <ScrollableMessages>
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
                  <CreateNewMessageEditor topicId={topic.id} isDisabled={isComposerDisabled} />
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

  background: ${theme.colors.layout.foreground((modifiers: Modifiers) => [modifiers.opacity(0.65)])};
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
