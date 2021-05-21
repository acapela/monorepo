import styled from "styled-components";
import { routes } from "~frontend/../routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useAddTopicMember, useRemoveTopicMember } from "~frontend/gql/topics";
import { ItemTitle } from "~ui/typo";
import { MembersManager } from "../MembersManager";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export function TopicCard({ topic }: Props) {
  const topicId = topic.id;
  const user = useAssertCurrentUser();

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
    <UIHolder onClick={handleOpen}>
      <UIInfo>
        <ItemTitle>Topic: {topic.name}</ItemTitle>
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
}

const UIHolder = styled.div``;

const UIInfo = styled.div`
  text-align: center;
`;

const UIMembers = styled.div``;
