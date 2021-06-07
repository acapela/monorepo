import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { routes } from "~frontend/routes";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { Button } from "~ui/buttons/Button";
import { TopicMenuItem } from "./TopicMenuItem";

interface Props {
  roomId: string;
  activeTopicId: string | null;
}

export function TopicsList({ roomId, activeTopicId }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [roomData] = useSingleRoomQuery({ id: roomId });
  const [newlyCreatedTopic, setNewlyCreatedTopic] = useState<string | null>(null);

  const room = roomData?.room;

  const topics = room?.topics ?? [];

  /*
    Routing on new topic

    Routing to new topics is only done after finding our created topic inside a subscription.

    This is done in order to prevent a race-condition between room data, and mechanisms
    that handle routing in the Room page.
  */
  useEffect(() => {
    const found = topics.find(({ id }) => id === newlyCreatedTopic);
    if (found) {
      const {
        id: topicId,
        room: { space_id: spaceId, id: roomId },
      } = found;

      routes.spaceRoomTopic.push({ topicId, spaceId, roomId });
      setNewlyCreatedTopic(null);
    }
  }, [topics]);

  async function handleCreateTopic() {
    const topic = await startCreateNewTopicFlow({
      roomId,
      modalAnchor: {
        ref: buttonRef,
        placement: "bottom-start",
      },
      navigateAfterCreation: true,
    });

    setNewlyCreatedTopic(topic?.id ?? null);
  }

  return (
    <>
      {topics.length === 0 && <UINoAgendaMessage>This room has no topics yet.</UINoAgendaMessage>}

      {topics.map((topic) => {
        const isActive = activeTopicId === topic.id;

        return (
          <UITopic key={topic.id}>
            <TopicMenuItem topic={topic} isActive={isActive} />
          </UITopic>
        );
      })}
      <Button ref={buttonRef} onClick={handleCreateTopic}>
        Add topic
      </Button>
    </>
  );
}

const UITopic = styled.div`
  position: relative;

  margin-bottom: 1rem;

  ${TopicMenuItem} {
    margin-bottom: 0.25rem;
  }
`;

const UINoAgendaMessage = styled.div`
  margin-bottom: 1rem;
`;
