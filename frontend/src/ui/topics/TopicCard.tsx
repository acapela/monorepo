import styled from "styled-components";
import { hoverActionCss, hoverActionNegativeSpacingCss } from "~ui/transitions";
import { routes } from "~frontend/routes";
import { TopicDetailedInfoFragment } from "~gql";
import { useAddTopicMemberMutation, useRemoveTopicMemberMutation } from "~frontend/gql/topics";
import { TextTitle } from "~ui/typo";
import { MembersManager } from "../MembersManager";
import { useTopicUnreadMessagesCount } from "~frontend/utils/unreadMessages";
import { ElementNotificationBadge } from "~frontend/ui/ElementNotificationBadge";
import { formatNumberWithMaxCallback } from "~shared/numbers";

interface Props {
  topic: TopicDetailedInfoFragment;
  className?: string;
}

export const TopicCard = styled(function TopicCard({ topic, className }: Props) {
  const topicId = topic.id;
  const unreadCount = useTopicUnreadMessagesCount(topic.id);

  const [addTopicMember] = useAddTopicMemberMutation();
  const [removeTopicMember] = useRemoveTopicMemberMutation();

  async function handleJoin(userId: string) {
    await addTopicMember({ userId, topicId });
  }

  async function handleLeave(userId: string) {
    await removeTopicMember({ userId, topicId });
  }

  function handleOpen() {
    routes.spaceRoomTopic.push({ roomId: topic.room.id, spaceId: topic.room.space_id, topicId: topic.id });
  }

  return (
    <UIHolder onClick={handleOpen} className={className}>
      {unreadCount > 0 && (
        <ElementNotificationBadge>{formatNumberWithMaxCallback(unreadCount, 99)}</ElementNotificationBadge>
      )}
      <UIInfo>
        <TextTitle>{topic.name}</TextTitle>
        <UIMembers>
          <MembersManager
            users={topic.members.map((m) => m.user)}
            onAddMemberRequest={handleJoin}
            onLeaveRequest={handleLeave}
          />
        </UIMembers>
      </UIInfo>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${hoverActionNegativeSpacingCss}
  ${hoverActionCss}
  cursor: pointer;
  position: relative;
  /* width: 100%; */
`;

const UIInfo = styled.div`
  ${TextTitle} {
    margin-bottom: 0.5rem;
  }
`;

const UIMembers = styled.div``;
