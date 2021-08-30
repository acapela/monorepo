import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { AnimateSharedLayout } from "framer-motion";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { withFragments } from "~frontend/gql/utils";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { isTopicClosed } from "~frontend/topics/utils";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import {
  TOPIC_WITH_MESSAGES_QUERY,
  usePresentMessagesSubscription,
} from "~frontend/views/RoomView/TopicWithMessages/gql";
import {
  NewestTopicMessageSubscription,
  NewestTopicMessageSubscriptionVariables,
  TopicClosureSubscription,
  TopicClosureSubscriptionVariables,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
  TopicWithMessages_RoomFragment,
  TopicWithMessages_TopicFragment,
  UpdateLastSeenMessageMutation,
  UpdateLastSeenMessageMutationVariables,
} from "~gql";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { disabledCss } from "~ui/disabled";
import { theme } from "~ui/theme";
import { Modifiers } from "~ui/theme/colors/createColor";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
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

// Marks last message as read
function useMarkTopicAsRead(topicId: string | null, messageIds: Set<string> | null) {
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
    if (!messageIds || !topicId) {
      return;
    }

    const lastMessageId = Array.from(messageIds).pop();

    if (!lastMessageId) {
      return;
    }

    updateLastSeenMessage({ variables: { topicId, messageId: lastMessageId } });
  }, [messageIds, topicId, updateLastSeenMessage]);
}

// use this to extract the last updated message timestamp and use that to subscribe only to changes after that
function useLastUpdatedAt() {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const updateLastUpdatedAt = useCallback(
    (messages: { updated_at: string }[]) => {
      const newValue = _.max(messages.map((m) => m.updated_at));
      if (newValue) {
        setLastUpdatedAt(newValue);
      }
    },
    [setLastUpdatedAt]
  );

  return [lastUpdatedAt, updateLastUpdatedAt] as const;
}

export const TopicWithMessages = withFragments(fragments, ({ room, topic }: Props) => {
  const [lastUpdatedAt, updateLastUpdatedAt] = useLastUpdatedAt();
  const {
    data,
    loading: isLoadingMessages,
    subscribeToMore,
  } = useQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>(
    TOPIC_WITH_MESSAGES_QUERY,
    topic
      ? {
          variables: { topicId: topic.id },
          onCompleted(data) {
            updateLastUpdatedAt(data?.messages ?? []);
          },
        }
      : { skip: true }
  );
  const presentMessageIds = usePresentMessagesSubscription(topic?.id);
  const messages = data?.messages ?? [];

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

  useMarkTopicAsRead(topic?.id ?? null, presentMessageIds);

  useEffect(() => {
    if (!topic || !lastUpdatedAt) {
      return;
    }
    return subscribeToMore<NewestTopicMessageSubscription, NewestTopicMessageSubscriptionVariables>({
      document: gql`
        ${MessagesFeed.fragments.message}

        subscription NewestTopicMessage($topicId: uuid!, $lastUpdatedAt: timestamptz!) {
          messages: message(where: { topic_id: { _eq: $topicId }, updated_at: { _gt: $lastUpdatedAt } }) {
            id
            created_at
            updated_at
            ...Message_message
          }
        }
      `,
      variables: { topicId: topic.id, lastUpdatedAt },
      updateQuery(query, { subscriptionData }) {
        const updatedMessages = subscriptionData.data.messages;
        updateLastUpdatedAt(updatedMessages);

        const existingMessageIds = new Set(query.messages.map((m) => m.id));
        const newMessages = updatedMessages.filter((m) => !existingMessageIds.has(m.id));

        return {
          ...query,
          messages: [...query.messages, ..._.sortBy(newMessages, (m) => new Date(m.created_at))],
        };
      },
    });
  }, [topic, subscribeToMore, lastUpdatedAt, updateLastUpdatedAt]);

  if (!topic) {
    return null;
  }

  const isClosed = isTopicClosed(topic);

  const isComposerDisabled = !isMember || !data?.messages;

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
