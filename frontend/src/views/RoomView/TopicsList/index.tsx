import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { routes } from "~frontend/routes";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { startCreateNewTopicFlow } from "~frontend/topics/startCreateNewTopicFlow";
import { Button } from "~ui/buttons/Button";
import { TopicMenuItem } from "./TopicMenuItem";
import { PageTitle } from "~ui/typo";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ACTION_ACTIVE_COLOR } from "~ui/transitions";

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
      <DragDropContext onDragEnd={(props) => console.log(props)}>
        <Droppable droppableId={"droppable-id-static"}>
          {({ droppableProps, innerRef, placeholder: droppablePlaceholder }) => (
            <UITopicsList {...droppableProps} ref={innerRef}>
              {topics.map((topic, index) => {
                const isActive = activeTopicId === topic.id;

                return (
                  <Draggable key={topic.id} draggableId={topic.id} index={index}>
                    {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
                      <UITopic ref={innerRef} {...draggableProps} {...dragHandleProps} isDragging={isDragging}>
                        <TopicMenuItem topic={topic} isActive={isActive} />
                      </UITopic>
                    )}
                  </Draggable>
                );
              })}
              {droppablePlaceholder}
            </UITopicsList>
          )}
        </Droppable>
      </DragDropContext>
      {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>})
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
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;

const UITopic = styled.div<{ isDragging: boolean }>`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }

  ${({ isDragging }) =>
    isDragging
      ? `
  background: ${ACTION_ACTIVE_COLOR};
  border-radius: 8px;
  `
      : ""}
`;

const UINoTopicsMessage = styled.div``;
