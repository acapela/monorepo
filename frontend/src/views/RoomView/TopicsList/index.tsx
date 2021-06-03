import React, { useRef } from "react";
import styled from "styled-components";
import { slugify } from "~shared/slugify";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useCreateTopicMutation, useUnreadMessages } from "~frontend/gql/topics";
import { createNextIndex } from "~frontend/rooms/order";
import { routes } from "~frontend/routes";
import { UnreadTopicIndicator } from "~frontend/ui/UnreadTopicsIndicator";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { TopicMenuItem } from "./TopicMenuItem";

interface Props {
  roomId: string;
  activeTopicId: string | null;
}

export function TopicsList({ roomId, activeTopicId }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [roomData] = useSingleRoomQuery.subscription({ id: roomId });
  const [unreadMessagesData] = useUnreadMessages.subscription();
  const [createTopic] = useCreateTopicMutation();

  const room = roomData?.room;

  const topics = room?.topics ?? [];

  async function handleCreateTopic() {
    const topicName = await openUIPrompt({
      title: "New topic name",
      submitLabel: "Create topic",
      placeholder: "Our brand colors",
      anchor: {
        ref: buttonRef,
        placement: "bottom-start",
      },
    });
    if (!topicName?.trim()) {
      return;
    }

    const index = createNextIndex();
    const slug = slugify(topicName);

    const { data: createTopicResult } = await createTopic({
      name: topicName,
      slug,
      index,
      roomId,
    });

    const topic = createTopicResult?.topic;

    if (!topic) {
      return;
    }

    routes.spaceRoomTopic.push({ topicId: topic.id, spaceId: topic.room.space_id, roomId: topic.room.id });
  }

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
