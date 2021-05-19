import { useRouter } from "next/router";
import styled from "styled-components";
import { routes } from "~frontend/../routes";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useAddTopicMember, useRemoveTopicMember } from "~frontend/gql/topics";
import { Button } from "~ui/button";
import { ItemTitle } from "~ui/typo";
import { AvatarList } from "../AvatarList";

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

  function getIsMember() {
    return topic.members.some((member) => member.user.id === user?.id);
  }

  const isMember = getIsMember();

  function handleOpen() {
    routes.spaceRoomTopic.push({ roomId: topic.room.id, spaceId: topic.room.space_id, topicId: topic.id });
  }

  return (
    <UIHolder>
      <UIInfo>
        <ItemTitle onClick={handleOpen}>Topic: {topic.name}</ItemTitle>
        <UIMembers>
          <AvatarList users={topic.members.map((m) => m.user)} />
        </UIMembers>
        {!isMember && <Button onClick={handleJoin}>Join</Button>}
        {isMember && <Button onClick={handleLeave}>Leave</Button>}
      </UIInfo>
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UIImage = styled.div`
  padding-bottom: 58%;
  background-color: #fccedd;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;
const UIInfo = styled.div`
  text-align: center;
`;

const UIMembers = styled.div``;
