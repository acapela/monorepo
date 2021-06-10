import styled from "styled-components";
import { hoverActionCss, hoverActionNegativeSpacingCss } from "~ui/transitions";
import { routes } from "~frontend/routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useAddTopicMember, useRemoveTopicMember } from "~frontend/gql/topics";
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
  const user = useAssertCurrentUser();
  const unreadCount = useTopicUnreadMessagesCount(topic.id);

  const [addTopicMember] = useAddTopicMember();
  const [removeTopicMember] = useRemoveTopicMember();

  async function handleJoin() {
    await addTopicMember({ userId: user.id, topicId });
  }

  async function handleLeave() {
    await removeTopicMember({ userId: user.id, topicId });
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
        <TextTitle>Topic: {topic.name}</TextTitle>
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
`;

const UIInfo = styled.div`
  ${TextTitle} {
    margin-bottom: 0.5rem;
  }
`;

const UIMembers = styled.div``;
