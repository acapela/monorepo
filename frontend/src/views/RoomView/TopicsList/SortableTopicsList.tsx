import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useMemo, useState } from "react";

import { TopicDetailedInfoFragment } from "~gql";
import { BodyPortal } from "~ui/BodyPortal";

import { UITopic, UITopicsList } from "./shared";
import { SortableTopicMenuItem, TopicMenuItem } from "./TopicMenuItem";

interface Props {
  topics: TopicDetailedInfoFragment[];
  isDisabled?: boolean;
  activeTopicId: string | null;
  onMoveToStart: (toMove: TopicDetailedInfoFragment) => void;
  onMoveToEnd: (toMove: TopicDetailedInfoFragment) => void;
  onMoveBetween: (
    toMove: TopicDetailedInfoFragment,
    start: TopicDetailedInfoFragment,
    end: TopicDetailedInfoFragment
  ) => void;
}

export const SortableTopicsList = ({
  topics,
  activeTopicId,
  isDisabled,
  onMoveToStart: moveToStart,
  onMoveToEnd: moveToEnd,
  onMoveBetween: moveBetween,
}: Props) => {
  const [draggedTopicId, setDraggedId] = useState<string | null>(null);
  const draggedTopicIndex = useMemo(
    () => topics.findIndex((topic) => topic.id == draggedTopicId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggedTopicId]
  );

  const draggedTopic = topics.find((topic) => topic.id === draggedTopicId);

  // Sensors can be used to support multiple input modalities for drag-and-drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 250, tolerance: 200 } }));

  function handleDragStart({ active }: DragStartEvent) {
    setDraggedId(active.id);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setDraggedId(null);
    if (!over || active.id === over.id) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const overIndex = topics.findIndex((topic) => topic.id == over.id)!;
    if (overIndex === 0) {
      moveToStart(topics[draggedTopicIndex]);
      return;
    }

    if (overIndex === topics.length - 1) {
      moveToEnd(topics[draggedTopicIndex]);
      return;
    }

    // overTopic indexes differ depending if the draggedTopic comes before/after item
    const { start, end } =
      overIndex > draggedTopicIndex
        ? { start: overIndex, end: overIndex + 1 }
        : { start: overIndex - 1, end: overIndex };

    moveBetween(topics[draggedTopicIndex], topics[start], topics[end]);
  }

  return (
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
              <SortableTopicMenuItem isDisabled={isDisabled} topic={topic} isActive={activeTopicId === topic.id} />
            </UITopic>
          ))}
        </SortableContext>
      </UITopicsList>
      <BodyPortal>
        <DragOverlay>
          {draggedTopic && (
            <TopicMenuItem topic={draggedTopic} isActive={activeTopicId === draggedTopic.id} isDragged />
          )}
        </DragOverlay>
      </BodyPortal>
    </DndContext>
  );
};
