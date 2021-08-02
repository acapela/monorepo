import React, { useEffect, useRef } from "react";
import { routes } from "~frontend/routes";
import { Button } from "~ui/buttons/Button";
import { useRoomTopicList } from "~frontend/rooms/useRoomTopicList";
import { useBulkTopicIndexing } from "~frontend/rooms/useBulkIndexing";
import { StaticTopicsList } from "./StaticTopicsList";
import { LazyTopicsList } from "./LazyTopicsList";
import styled from "styled-components";
import { TextH6 } from "~ui/typo";
import { RoomDetailedInfoFragment } from "~gql";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { useNewItemInArrayEffect } from "~shared/hooks/useNewItemInArrayEffect";
import { useRoomStoreContext } from "~frontend/rooms/RoomStore";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { RouteLink } from "~frontend/routes/RouteLink";

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

  const [bulkReorder, { loading: isExecutingBulkReorder }] = useBulkTopicIndexing();
  const { topics, moveBetween, moveToStart, moveToEnd, isReordering } = useRoomTopicList(room.id);
  const amIMember = isCurrentUserRoomMember(room);

  /**
   * ## Bulk reordering
   *
   * go to hook definition for explanation
   */
  useEffect(() => {
    if (topics && topics.every(({ index }) => !index || index.trim().length === 0)) {
      const topicIds = topics.map(({ id }) => id);
      bulkReorder(topicIds);
    }
  }, [topics]);

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
            <RouteLink route={routes.spaceRoomSummary} params={{ roomId, spaceId }}>
              <Button size="small" kind="secondary" ref={buttonRef}>
                Room summary
              </Button>
            </RouteLink>
          )}
        </UIHeader>
      }
    >
      <UIHolder>
        {amIMember && (
          <LazyTopicsList
            topics={topics}
            activeTopicId={activeTopicId}
            isDisabled={isExecutingBulkReorder || isReordering}
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
