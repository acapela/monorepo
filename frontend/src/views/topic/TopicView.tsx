import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { Message as MessageType } from "~db";
import { useIsCurrentUserRoomMember } from "~frontend/gql/rooms";
import { updateLastSeenMessage, useSingleTopicQuery, useTopicMessagesQuery } from "~frontend/gql/topics";
import { waitForAllRunningMutationsToFinish } from "~frontend/gql/utils";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { useTopic } from "~frontend/topics/useTopic";
import { CreateNewMessageEditor } from "~frontend/ui/message/composer/CreateNewMessageEditor";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
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

interface Props {
  topicId: string;
}

function useMarkTopicAsRead(topicId: string, messages: Pick<MessageType, "id">[]) {
  /**
   * Let's mark last message as read each time we have new messages.
   */
  useAsyncLayoutEffect(async () => {
    if (!messages) return;

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

export const TopicView = ({ topicId }: Props) => {
  const [topic = null] = useSingleTopicQuery({ id: topicId });

  const [messages = []] = useTopicMessagesQuery({
    topicId: topicId,
  });

  const isMember = useIsCurrentUserRoomMember(topic?.room);

  useMarkTopicAsRead(topicId, messages);

  const { isParentRoomOpen, isClosed: isTopicClosed, topicCloseInfo } = useTopic(topic);

  if (!topic) return null;

  return (
    <TopicStoreContext>
      <UIHolder>
        {/* Absolutely placed backdrop will take it's width relative to the width its container */}
        {/* This works as this nested container holds no padding/margin left or right */}
        <UIBackdropContainer>
          <UIBackDrop />
          <UIMainContainer>
            {/* We need to render the topic header wrapper or else flex bugs out on page reload */}
            <UITopicHeaderHolder>{topic && <TopicHeader topic={topic} />}</UITopicHeaderHolder>

            <ScrollableMessages>
              <AnimateSharedLayout>
                <MessagesFeed isReadonly={!isMember} messages={messages} />

                {topic && topicCloseInfo && <TopicSummaryMessage topic={topic} />}
              </AnimateSharedLayout>

              {!messages.length && !topicCloseInfo && (
                <UIContentWrapper>Start the conversation and add your first message below.</UIContentWrapper>
              )}

              {isTopicClosed && <TopicClosureNote isParentRoomOpen={isParentRoomOpen} />}
            </ScrollableMessages>

            {!isTopicClosed && (
              <ClientSideOnly>
                <UIMessageComposer isDisabled={!isMember}>
                  <CreateNewMessageEditor topicId={topicId} isDisabled={!isMember} />
                </UIMessageComposer>
              </ClientSideOnly>
            )}
          </UIMainContainer>
        </UIBackdropContainer>
      </UIHolder>
    </TopicStoreContext>
  );
};

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
