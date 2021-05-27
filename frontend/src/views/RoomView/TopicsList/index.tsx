import React from "react";
import styled from "styled-components";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useUnreadMessages } from "~frontend/gql/topics";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { routes } from "~frontend/routes";
import { UnreadTopicIndicator } from "~frontend/ui/UnreadTopicsIndicator";
import { Button } from "~ui/button";
import { AddTopicModal } from "./AddTopicModal";
import { TopicMenuItem } from "./TopicMenuItem";

interface Props {
  roomId: string;
  activeTopicId: string | null;
}

export function TopicsList({ roomId, activeTopicId }: Props) {
  const [roomData] = useSingleRoomQuery.subscription({ id: roomId });
  const [unreadMessagesData] = useUnreadMessages.subscription();
  const [isAddingTopic, { set: openAddTopicModal, unset: closeAddTopicModal }] = useBoolean(false);

  const room = roomData?.room;

  const topics = room?.topics ?? [];

  return (
    <>
      {isAddingTopic && (
        <AddTopicModal
          roomId={roomId}
          onCloseRequest={closeAddTopicModal}
          onCreated={(topic: TopicDetailedInfoFragment) =>
            routes.spaceRoomTopic.push({ topicId: topic.id, spaceId: topic.room.space_id, roomId: topic.room.id })
          }
        />
      )}

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
      <Button onClick={openAddTopicModal}>Add topic</Button>
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
