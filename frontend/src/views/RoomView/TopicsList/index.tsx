import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { routes } from "~frontend/routes";
import { RoomDetailedInfoFragment } from "~gql";
import { useNewItemInArrayEffect } from "~shared/hooks/useNewItemInArrayEffect";
import { Button } from "~ui/buttons/Button";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { TextH6 } from "~ui/typo";
import { LazyTopicsList } from "./LazyTopicsList";
import { StaticTopicsList } from "./StaticTopicsList";

interface Props {
  room: RoomDetailedInfoFragment;
  activeTopicId: string | null;
  isRoomOpen: boolean;
}

export const TopicsList = observer(function TopicsList({ room, activeTopicId, isRoomOpen }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const roomId = room.id;
  const spaceId = room.space_id;
  const roomContext = useRoomStoreContext();

  const { topics, moveBetween, moveToStart, moveToEnd, isReordering } = useRoomTopicList(room.id);
  const amIMember = isCurrentUserRoomMember(room);

  useNewItemInArrayEffect(
    topics,
    (topic) => topic.id,
    (newTopic) => {
      runInAction(() => {
        roomContext.newTopicId = newTopic.id;
        roomContext.editingNameTopicId = newTopic.id;
      });
      routes.spaceRoomTopic.push({ topicId: newTopic.id, spaceId: room.space_id, roomId: room.id });
    }
  );

  return (
    <CollapsePanel
      persistanceKey={`room-topics-${room.id}`}
      initialIsOpened={true}
      headerNode={
        <UIHeader>
          <TextH6 spezia semibold>
            Topics
          </TextH6>
          {!isRoomOpen && (
            <routes.spaceRoomSummary.Link params={{ roomId, spaceId }}>
              <Button size="small" kind="secondary" ref={buttonRef}>
                Room summary
              </Button>
            </routes.spaceRoomSummary.Link>
          )}
        </UIHeader>
      }
    >
      <UIHolder>
        {amIMember && (
          <LazyTopicsList
            topics={topics}
            activeTopicId={activeTopicId}
            isDisabled={isReordering}
            onMoveBetween={moveBetween}
            onMoveToStart={moveToStart}
            onMoveToEnd={moveToEnd}
          />
        )}
        {!amIMember && <StaticTopicsList topics={topics} activeTopicId={activeTopicId} />}
        {topics.length === 0 && <UINoTopicsMessage>This room has no topics yet.</UINoTopicsMessage>}
      </UIHolder>
    </CollapsePanel>
  );
});

const UIHolder = styled.div<{}>`
  overflow-y: hidden;
  margin-top: 16px;
`;

const UIHeader = styled.div<{}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UINoTopicsMessage = styled.div<{}>``;
