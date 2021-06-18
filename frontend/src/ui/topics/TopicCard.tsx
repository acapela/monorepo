import styled, { css } from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { routes } from "~frontend/routes";
import { TopicDetailedInfoFragment, TopicMessageBasicInfoFragment } from "~gql";
import { TextTitle } from "~ui/typo";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { BACKGROUND_ACCENT_WEAK, NOTIFICATION_COLOR, SECONDARY_FONT_COLOR } from "~ui/colors";
import { useTopicMessagesQuery } from "~frontend/gql/topics";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import React from "react";
import { Avatar } from "../users/Avatar";

interface Props {
  topic: TopicDetailedInfoFragment;
  className?: string;
}

function renderMessageContent(message: TopicMessageBasicInfoFragment) {
  try {
    const converter = new QuillDeltaToHtmlConverter(message.content, {});

    const htmlContent = converter.convert();
    const strippedHtml = htmlContent.replace(/<[^>]+>/g, " ");

    return <span id="UITextMessage" dangerouslySetInnerHTML={{ __html: strippedHtml }}></span>;
  } catch (error) {
    return <div>😢 Failed to display message content</div>;
  }
}

export const TopicCard = styled(function TopicCard({ topic, className }: Props) {
  const topicId = topic.id;
  const unreadCount = useTopicUnreadMessagesCount(topic.id);

  const [lastMessageWrapped = []] = useTopicMessagesQuery({
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

  const isClosed = !!(topic.closed_at && topic.closed_at.length > 0);

  return (
    <UIHolder onClick={handleOpen} className={className}>
      <UIInfo>
        {unreadCount > 0 && <UIUnreadMessagesNotification />}
        <UITopicTitle isClosed={isClosed}>{topic.name}</UITopicTitle>
        {lastMessage && (
          <UILastMessage>
            <UILastMessageSender
              size="font-size"
              url={lastMessage.user.avatar_url}
              name={lastMessage.user.name ?? ""}
            />
            <UILastMessageContent>{renderMessageContent(lastMessage)}</UILastMessageContent>
          </UILastMessage>
        )}
      </UIInfo>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  padding: 16px 16px 16px 32px;

  position: relative;

  ${hoverActionCss}
  cursor: pointer;

  border: 1px solid ${BACKGROUND_ACCENT_WEAK};
`;

const UIInfo = styled.div`
  display: grid;
`;

const UITopicTitle = styled(TextTitle)<{ isClosed: boolean }>`
  ${(props) => {
    if (props.isClosed) {
      return css`
        text-decoration: line-through;
        color: ${SECONDARY_FONT_COLOR};
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

  color: ${SECONDARY_FONT_COLOR};
`;

const UILastMessageSender = styled(Avatar)``;

const UILastMessageContent = styled.div`
  display: grid;

  #UITextMessage {
    line-height: 1.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
