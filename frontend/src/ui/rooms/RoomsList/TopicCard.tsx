import React from "react";
import styled, { css } from "styled-components";

import { useTopicMessagesQuery } from "~frontend/gql/topics";
import { RouteLink, routes } from "~frontend/router";
import { useTopic } from "~frontend/topics/useTopic";
import { MessageText } from "~frontend/ui/message/display/types/TextMessageContent";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { TopicDetailedInfoFragment } from "~gql";
import { theme } from "~ui/theme";
import { TextH6 } from "~ui/typo";

import { UICardListItem } from "./shared";

interface Props {
  topic: TopicDetailedInfoFragment;
  className?: string;
}

export const TopicCard = styled(function TopicCard({ topic, className }: Props) {
  const topicId = topic.id;
  const unreadCount = useTopicUnreadMessagesCount(topic.id);

  const { isClosed } = useTopic(topic);

  const [lastMessageWrapped = [], { loading: isLastMessageLoading }] = useTopicMessagesQuery({
    topicId,
    order: "desc",
    limit: 1,
    typeExpression: {
      _eq: "TEXT",
    },
  });

  const lastMessage = lastMessageWrapped.length > 0 ? lastMessageWrapped[0] : null;

  return (
    <RouteLink
      route={routes.spaceRoomTopic}
      params={{ roomId: topic.room.id, spaceId: topic.room.space_id, topicId: topic.id }}
    >
      <UIHolder className={className}>
        <UIInfo>
          {unreadCount > 0 && <UIUnreadMessagesNotification />}
          <UITopicTitle isClosed={isClosed} spezia medium>
            {topic.name}
          </UITopicTitle>
          {isLastMessageLoading && (
            <UILastMessage>
              <UIMessagePlaceholder>Loading...</UIMessagePlaceholder>
            </UILastMessage>
          )}
          {lastMessage && !isLastMessageLoading && (
            <UILastMessage>
              <UILastMessageSender size="inherit" user={lastMessage.user} />
              <UIMessageText message={lastMessage} />
            </UILastMessage>
          )}
          {!lastMessage && !isLastMessageLoading && (
            <UILastMessage>
              <UIMessagePlaceholder>No messages in topic</UIMessagePlaceholder>
            </UILastMessage>
          )}
        </UIInfo>
      </UIHolder>
    </RouteLink>
  );
})``;

const UIHolder = styled(UICardListItem)<{}>``;

const UIInfo = styled.div<{}>`
  display: grid;
`;

const UITopicTitle = styled(TextH6)<{ isClosed: boolean }>`
  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        opacity: 0.5;
      `;
    }
  }}
`;

const UIUnreadMessagesNotification = styled.div<{}>`
  position: absolute;
  left: 16px;
  top: calc(50% - 8px);

  height: 8px;
  width: 8px;
  border-radius: 8px;

  background-color: ${theme.colors.interactive.notification()};
`;

const UILastMessage = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding-top: 8px;
`;

const UILastMessageSender = styled(UserAvatar)<{}>``;

const UIMessagePlaceholder = styled.div<{}>`
  display: grid;
  opacity: 0.5;
  line-height: 1.5rem;
`;

const UIMessageText = styled(MessageText)`
  ${theme.font.body14.build()}
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;
