import React from "react";
import styled from "styled-components";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useUnreadMessages } from "~frontend/gql/topics";
import { TopicCreationButton } from "~frontend/rooms/TopicCreationButton";
import { UnreadTopicIndicator } from "~frontend/ui/UnreadTopicsIndicator";
import { TopicMenuItem } from "./TopicMenuItem";

interface Props {
  roomId: string;
  activeTopicId: string | null;
}

export function TopicsList({ roomId, activeTopicId }: Props) {
  const [roomData] = useSingleRoomQuery.subscription({ id: roomId });
  const [unreadMessagesData] = useUnreadMessages.subscription();

  const room = roomData?.room;

  const topics = room?.topics ?? [];

  return (
    <>
      {topics.length === 0 && <UINoAgendaMessage>This room has no topics yet.</UINoAgendaMessage>}

      {topics.map((topic) => {
        const unreadMessages = unreadMessagesData?.messages.find((m) => m.topicId === topic.id)?.unreadMessages ?? 0;

        const isActive = activeTopicId === topic.id;

        return (
          <UITopic key={topic.id}>
            <UnreadTopicIndicator unreadMessages={unreadMessages} />
            <TopicMenuItem topic={topic} isActive={isActive} />
          </UITopic>
        );
      })}
      <TopicCreationButton roomId={room?.id} />
    </>
  );
}

const UITopic = styled.div`
  position: relative;

  margin-bottom: 1rem;

  ${TopicMenuItem} {
    margin-bottom: 0.5rem;
  }
`;

const UINoAgendaMessage = styled.div`
  margin-bottom: 1rem;
`;
