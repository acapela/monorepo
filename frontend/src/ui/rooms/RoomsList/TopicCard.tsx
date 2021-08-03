import styled, { css } from "styled-components";
import { routes } from "~frontend/router";
import { TopicDetailedInfoFragment, MessageBasicInfoFragment } from "~gql";
import { TextH6 } from "~ui/typo";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { NOTIFICATION_COLOR } from "~ui/theme/colors/base";
import { useTopicMessagesQuery } from "~frontend/gql/topics";
import React from "react";
import { useTopic } from "~frontend/topics/useTopic";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UICardListItem } from "./shared";
import { convertRichEditorContentToHtml } from "~richEditor/content/html";
import { RouteLink } from "~frontend/router/RouteLink";

interface Props {
  topic: TopicDetailedInfoFragment;
  className?: string;
}

function renderMessageContent(message: MessageBasicInfoFragment) {
  try {
    const htmlContent = convertRichEditorContentToHtml(message.content);

    const strippedHtml = htmlContent.replace(/<[^>]+>/g, " ");

    return <span id="UILastMessageContent__message" dangerouslySetInnerHTML={{ __html: strippedHtml }}></span>;
  } catch (error) {
    return <div>😢 Failed to display message content</div>;
  }
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
              <UILastMessageContent>Loading...</UILastMessageContent>
            </UILastMessage>
          )}
          {lastMessage && !isLastMessageLoading && (
            <UILastMessage>
              <UILastMessageSender size="inherit" user={lastMessage.user} />
              <UILastMessageContent>{renderMessageContent(lastMessage)}</UILastMessageContent>
            </UILastMessage>
          )}
          {!lastMessage && !isLastMessageLoading && (
            <UILastMessage>
              <UILastMessageContent>No messages in topic</UILastMessageContent>
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

  background-color: ${NOTIFICATION_COLOR};
`;

const UILastMessage = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding-top: 8px;
`;

const UILastMessageSender = styled(UserAvatar)<{}>``;

const UILastMessageContent = styled.div<{}>`
  display: grid;
  opacity: 0.5;
  line-height: 1.5rem;

  #UILastMessageContent__message {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
