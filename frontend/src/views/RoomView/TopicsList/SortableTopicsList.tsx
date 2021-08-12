import { gql } from "@apollo/client";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useMemo, useState } from "react";

import { withFragments } from "~frontend/gql/utils";
import {
  getIndexBetweenCurrentAndLast,
  getIndexBetweenFirstAndCurrent,
  getIndexBetweenItems,
} from "~frontend/rooms/order";
import { useUpdateTopic } from "~frontend/views/RoomView/shared";
import { SortableTopicList_RoomFragment } from "~gql";

import { UIScrollContainer, UITopic, UITopicsList } from "./shared";
import { SortableTopicMenuItem } from "./TopicMenuItem";

const fragments = {
  room: gql`
    ${SortableTopicMenuItem.fragments.room}
    ${SortableTopicMenuItem.fragments.topic}

    fragment SortableTopicList_room on room {
      id
      ...TopicMenuItem_room
      topics {
        index
        ...TopicMenuItem_topic
      }
    }
  `,
};

type Props = {
  room: SortableTopicList_RoomFragment;
  isDisabled?: boolean;
  activeTopicId: string | null;
};
export const SortableTopicsList = withFragments(fragments, ({ room, activeTopicId, isDisabled }: Props) => {
  const { topics } = room;
  const [draggedTopicId, setDraggedId] = useState<string | null>(null);
  const draggedTopicIndex = useMemo(
    () => topics.findIndex((topic) => topic.id == draggedTopicId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggedTopicId]
  );
  const [updateTopic] = useUpdateTopic();

  // Sensors can be used to support multiple input modalities for drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart({ active }: DragStartEvent) {
    setDraggedId(active.id);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const overIndex = room.topics.findIndex((topic) => topic.id == over.id)!;
      let newIndex: string;
      if (overIndex === 0) {
        newIndex = getIndexBetweenFirstAndCurrent(topics[0].index);
      } else if (overIndex === topics.length - 1) {
        const lastTopicInList = topics[topics.length - 1];
        newIndex = getIndexBetweenCurrentAndLast(lastTopicInList.index);
      } else {
        // overTopic indexes differ depending if the draggedTopic comes before/after item
        const { start, end } =
          overIndex > draggedTopicIndex
            ? { start: overIndex, end: overIndex + 1 }
            : { start: overIndex - 1, end: overIndex };

        newIndex = getIndexBetweenItems(topics[start].index, topics[end].index);
      }
      updateTopic({ variables: { id: topics[draggedTopicIndex].id, input: { index: newIndex } } });
    }

    setDraggedId(null);
  }

  return (
    <UIScrollContainer>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToFirstScrollableAncestor]}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <UITopicsList>
          <SortableContext items={topics.map((topic) => topic.id)} strategy={verticalListSortingStrategy}>
            {topics.map((topic) => (
              <UITopic key={topic.id}>
                <SortableTopicMenuItem
                  isDisabled={isDisabled}
                  room={room}
                  topic={topic}
                  isActive={activeTopicId === topic.id}
                />
              </UITopic>
            ))}
          </SortableContext>
        </UITopicsList>
      </DndContext>
    </UIScrollContainer>
  );
});
