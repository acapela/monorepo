import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { routes } from "~frontend/routes";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { Button } from "~ui/buttons/Button";
import { TopicMenuItem } from "./TopicMenuItem";
import { PageTitle } from "~ui/typo";

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
    <UIHolder>
      <UIHeader>
        <UITitle>Topics</UITitle>
        <UINewTopicButton ref={buttonRef} onClick={handleCreateTopic}>
          New topic
        </UINewTopicButton>
      </UIHeader>
      <UITopicsList>
        {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>}

        {topics.map((topic) => {
          const isActive = activeTopicId === topic.id;

          return (
            <UITopic key={topic.id}>
              <TopicMenuItem topic={topic} isActive={isActive} />
            </UITopic>
          );
        })}
      </UITopicsList>
      )
    </UIHolder>
  );
}

const UIHolder = styled.div`
  overflow-y: hidden;
`;

const UITitle = styled(PageTitle)``;

const UINewTopicButton = styled(Button)``;

const UIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const UITopicsList = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const UITopic = styled.div`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }
`;

const UINoTopicsMessage = styled.div``;
