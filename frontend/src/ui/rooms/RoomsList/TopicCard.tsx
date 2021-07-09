import styled, { css } from "styled-components";
import { routes } from "~frontend/routes";
import { TopicDetailedInfoFragment, MessageBasicInfoFragment } from "~gql";
import { TextH3 } from "~ui/typo";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { NOTIFICATION_COLOR } from "~ui/colors";
import { useTopicMessagesQuery } from "~frontend/gql/topics";
import React from "react";
import { useTopic } from "~frontend/topics/useTopic";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { UICardListItem } from "./shared";
import { convertRichEditorContentToHtml } from "~richEditor/content/html";

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

  function handleOpen() {
    routes.spaceRoomTopic.push({ roomId: topic.room.id, spaceId: topic.room.space_id, topicId: topic.id });
  }

  return (
    <UIHolder onClick={handleOpen} className={className}>
      <UIInfo>
        {unreadCount > 0 && <UIUnreadMessagesNotification />}
        <UITopicTitle isClosed={isClosed}>{topic.name}</UITopicTitle>
        {isLastMessageLoading && (
          <UILastMessage>
            <UILastMessageContent>Loading...</UILastMessageContent>
          </UILastMessage>
        )}
        {lastMessage && !isLastMessageLoading && (
          <UILastMessage>
            <UILastMessageSender size="font-size" user={lastMessage.user} />
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
  );
})``;

const UIHolder = styled(UICardListItem)``;

const UIInfo = styled.div`
  display: grid;
`;

const UITopicTitle = styled(TextH3)<{ isClosed: boolean }>`
  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        opacity: 0.5;
      `;
    }
  }}
`;

const UIUnreadMessagesNotification = styled.div`
  position: absolute;
  left: 16px;
  top: calc(50% - 8px);

  height: 8px;
  width: 8px;
  border-radius: 8px;

  background-color: ${NOTIFICATION_COLOR};
`;

const UILastMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding-top: 8px;
`;

const UILastMessageSender = styled(UserAvatar)``;

const UILastMessageContent = styled.div`
  display: grid;
  opacity: 0.5;
  line-height: 1.5rem;

  #UILastMessageContent__message {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
