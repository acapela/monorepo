import React, { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { TopicDetailedInfoFragment } from "~gql";

import { UIScrollContainer, UITopic, UITopicsList } from "./shared";
import { SortableTopicMenuItem } from "./TopicMenuItem";

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
  const draggedTopicIndex = useMemo(() => topics.findIndex((topic) => topic.id == draggedTopicId), [draggedTopicId]);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart({ active }: DragStartEvent) {
    setDraggedId(active.id);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
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
                <SortableTopicMenuItem isDisabled={isDisabled} topic={topic} isActive={activeTopicId === topic.id} />
              </UITopic>
            ))}
          </SortableContext>
        </UITopicsList>
      </DndContext>
    </UIScrollContainer>
  );
};
